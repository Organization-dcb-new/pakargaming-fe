import { NextRequest, NextResponse } from "next/server";
import {
  INVOICE_PATTERN,
  REFERRAL_CODE_PATTERN,
  SLUG_PATTERN,
  UUID_PATTERN,
} from "@/lib/backendIds";
import { decryptPayload } from "@/lib/crypto";
import { getClientIp, UNKNOWN_CLIENT_IP } from "@/lib/clientIp";
import { CSRF_HEADER, CSRF_HEADER_VALUE, TURNSTILE_HEADER } from "@/lib/session";
import {
  clearGoogleBinding,
  clearSession,
  hasSessionCookie,
  readCookieUser,
  readGoogleBinding,
  readSessionToken,
  writeSession,
  writeUser,
} from "@/lib/sessionServer";
import { isTurnstileEnabled, verifyTurnstile } from "@/lib/turnstile";
import { getServerApiBaseUrl } from "@/config/runtimeEnv";

/**
 * Dibaca saat runtime dari .env server (bukan di-inline saat build): API_INTERNAL_URL (backend di network
 * Docker), kalau kosong NEXT_PUBLIC_API_BASE_URL — lihat src/config/runtimeEnv.ts.
 */
const BACKEND_URL = getServerApiBaseUrl();
const SITE_URL = process.env.NEXT_SITE_BASE_URL

/**
 * Rahasia bersama dengan backend (env runtime, server-only — jangan pernah NEXT_PUBLIC). Kalau diisi,
 * dikirim sebagai `X-Storefront-Key` di setiap request; backend hanya memercayai `X-Client-IP` /
 * `X-Client-User-Agent` dari request yang membawa kunci ini.
 */
const STOREFRONT_PROXY_SECRET = process.env.STOREFRONT_PROXY_SECRET;

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type RouteContext = { params: Promise<{ path: string[] }> };

const route = (pattern: string) => new RegExp(`^${pattern}$`);

/**
 * Endpoint backend yang boleh dipanggil browser lewat proxy ini — selain ini ditolak 404.
 * Backend hanya menerima request dari IP server FE (akses langsung dari internet dapat 403), jadi proxy
 * ini satu-satunya pintu dari luar: tanpa daftar ini endpoint internal/admin ikut terbuka.
 * Endpoint baru di FE → tambahkan di sini. Segmen id/slug pakai pola sempit dari src/lib/backendIds.ts,
 * bukan `[^/]+`: segmen bebas pernah dipakai untuk keluar dari allowlist ke endpoint admin
 * (`games/slug/%252e%252e`, `transactions/export-csv`).
 */
const ALLOWED_ROUTES: ReadonlyArray<readonly [Method, RegExp]> = [
  ["GET", route("v1/banners")],
  ["GET", route("v1/shows")],
  ["GET", route(`v1/games/(search|regions|slug/${SLUG_PATTERN})`)],
  ["GET", route(`v1/category-product/by-game/${UUID_PATTERN}`)],
  ["GET", route("v1/payment-categories/client")],
  ["GET", route(`v1/referral-codes/code/${REFERRAL_CODE_PATTERN}`)],
  ["POST", route("v1/transactions(/check-id)?")],
  ["GET", route("v1/transactions/email/dashboard")],
  ["GET", route(`v1/transactions/detail-trx/${INVOICE_PATTERN}`)],
  ["GET", route(`v1/transactions/${UUID_PATTERN}`)],
  ["POST", route("v1/auth/(login|register|forgot-password|reset-password)")],
  ["GET", route("v1/auth/me")],
  ["POST", route("v1/auth/google/(exchange|link|link/start)")],
  ["POST", route("v1/auth/verify-email(/resend)?")],
  ["DELETE", route("v1/auth/account")],
];

/** Endpoint publik: tidak pernah ditempeli sesi, dan 401 di sini berarti kredensial salah, bukan sesi habis. */
const PUBLIC_AUTH_PATHS = new Set([
  "v1/auth/login",
  "v1/auth/register",
  "v1/auth/forgot-password",
  "v1/auth/reset-password",
  "v1/auth/google/exchange",
  "v1/auth/verify-email",
]);

/** Respons berisi `{ token, user }` → token dipindah ke cookie HttpOnly dan dibuang dari body. */
const SESSION_ISSUING_PATHS = new Set([
  "v1/auth/login",
  "v1/auth/register",
  "v1/auth/google/exchange",
]);

/**
 * Target favorit bot (tebak password, spam akun, spam email reset, spam checkout) → wajib lolos
 * Turnstile kalau aktif. Checkout: tiap request membuat order + tagihan Paylabs, dan bot yang
 * berganti-ganti IP bisa menghabiskan kuota checkout bersama sehingga pembeli asli kena 429.
 */
const TURNSTILE_PATHS = new Set([
  "v1/auth/login",
  "v1/auth/register",
  "v1/auth/forgot-password",
  "v1/transactions",
]);

/** Tukar kode login Google: wajib membawa nonce dari cookie browser yang memulai login (kontrak M5). */
const GOOGLE_EXCHANGE_PATH = "v1/auth/google/exchange";

/** Hapus akun: setelah berhasil, cookie sesi browser ini ikut dibersihkan. */
const DELETE_ACCOUNT_PATH = "v1/auth/account";

/**
 * Kunci akses transaksi (review SEC1, 18 Nov 2026). Checkout mengembalikan `access_key`; proxy
 * memindahkannya ke cookie HttpOnly yang path-nya hanya `/api/proxy/v1/transactions/<id>`, jadi
 * browser pembeli mengirimnya saat membaca transaksi itu saja. Backend menampilkan kode voucher dan
 * email lengkap hanya kepada pemegang kunci, atau kepada pembeli yang login dengan email itu.
 */
const CHECKOUT_PATH = "v1/transactions";
const TRANSACTION_KEY_COOKIE = "pg_trx_key";
const TRANSACTION_KEY_HEADER = "X-Transaction-Key";
/** Selama vouchernya masih mungkin dibuka lagi; kodenya juga ada di email. */
const TRANSACTION_KEY_MAX_AGE = 60 * 60 * 24 * 30;
const TRANSACTION_ID = new RegExp(`^${UUID_PATTERN}$`);
const TRANSACTION_READ = new RegExp(`^v1/transactions/(${UUID_PATTERN})$`);

/**
 * Route panel admin yang dicoba lewat proxy ini. Storefront tidak pernah memanggilnya, jadi setiap
 * percobaan adalah pemindaian (seperti 15–17 Nov 2026: login admin, customers, export-csv, upload
 * lewat /api/proxy). Tiga bentuk: prefix route admin tepat setelah `v1/` (tanpa batas kata, supaya
 * `admin%2Fbrief`, `customers.json`, `admins` ikut), export-csv di mana saja, dan trik traversal
 * atau encoding yang menuju route admin (`games/%2e%2e/admin/me`).
 */
const ADMIN_PROBE_PATTERN =
  /^v1\/+(admin|activity-logs|customers|upload|roles|permissions|orders|summary|dashboard|cashflows|lapak-gaming|provider|supplier-|users)|export-csv|(\.\.|%2e|%2f|%5c).*(admin|customers|upload|roles|permissions|users)/i;

/** Backend yang menerima laporan percobaan di atas, lalu mengirim alert Telegram. */
const PROBE_REPORT_PATH = "v1/security/proxy-probes";

/** Batas laporan per menit per proses, supaya banjir percobaan tidak ikut membanjiri backend. */
const PROBE_REPORTS_PER_MINUTE = 20;
let probeWindowStart = 0;
let probeReportsInWindow = 0;

/**
 * Melaporkan route admin yang ditolak allowlist ke backend, tanpa ditunggu: gagal lapor tidak
 * mengubah jawaban 404. Hanya jalan kalau STOREFRONT_PROXY_SECRET diisi, karena backend menerima
 * laporan hanya dari request yang membawa kunci itu.
 */
function reportAdminProbe(method: Method, pathSegments: string[], clientIp: string, userAgent: string | null) {
  if (!STOREFRONT_PROXY_SECRET || !BACKEND_URL) return;
  const path = pathSegments.join("/").slice(0, 500);
  if (!ADMIN_PROBE_PATTERN.test(path)) return;

  const now = Date.now();
  if (now - probeWindowStart > 60_000) {
    probeWindowStart = now;
    probeReportsInWindow = 0;
  }
  if (++probeReportsInWindow > PROBE_REPORTS_PER_MINUTE) return;

  try {
    const base = new URL(BACKEND_URL);
    const url = `${base.origin}${base.pathname.replace(/\/+$/, "")}/${PROBE_REPORT_PATH}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Storefront-Key": STOREFRONT_PROXY_SECRET,
      "X-Client-IP": clientIp,
    };
    if (userAgent) headers["X-Client-User-Agent"] = userAgent.slice(0, 512);
    void fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ method, path }),
      signal: AbortSignal.timeout(3000),
    }).catch(() => undefined);
  } catch {
    // BACKEND_URL tidak valid: proxyRequest sudah melaporkannya sendiri.
  }
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  return proxyRequest(req, (await params).path, "GET");
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  return proxyRequest(req, (await params).path, "POST");
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  return proxyRequest(req, (await params).path, "PUT");
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  return proxyRequest(req, (await params).path, "PATCH");
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  return proxyRequest(req, (await params).path, "DELETE");
}

/**
 * Segmen sudah di-decode Next.js satu kali, jadi `%2e%2e`, `%2F`, `%3F` muncul sebagai `..`, `/`, `?`.
 * `%` dan `.` juga ditolak: `%252e%252e` tiba di sini sebagai `%2e%2e`, dan parser URL `fetch`
 * membacanya sebagai `..` (keluar dari allowlist). Tidak ada id/slug sah yang memakai keduanya.
 */
function resolveTargetPath(segments: string[]): string | null {
  for (const segment of segments) {
    if (!segment || /[/\\?#%.]/.test(segment)) return null;
  }
  return segments.join("/");
}

function isAllowed(method: Method, path: string) {
  return ALLOWED_ROUTES.some(([allowedMethod, pattern]) => allowedMethod === method && pattern.test(path));
}

/**
 * URL backend final. Path-nya dicek ulang SETELAH dinormalisasi `new URL()` (titik, encoding):
 * harus tetap sama dengan path yang lolos allowlist, di origin backend yang sama.
 */
function buildTargetUrl(method: Method, targetPath: string, search: string): URL | null {
  try {
    const base = new URL(BACKEND_URL as string);
    const basePath = base.pathname.replace(/\/+$/, "");
    const url = new URL(`${base.origin}${basePath}/${targetPath}`);
    url.search = search;

    if (url.origin !== base.origin || !url.pathname.startsWith(`${basePath}/`)) return null;
    const finalPath = url.pathname.slice(basePath.length + 1);
    if (finalPath !== targetPath || !isAllowed(method, finalPath)) return null;
    return url;
  } catch {
    return null;
  }
}

async function proxyRequest(req: NextRequest, pathSegments: string[], method: Method) {
  if (!BACKEND_URL) {
    console.error(
      "[Proxy Error] BACKEND_URL (API_INTERNAL_URL / NEXT_PUBLIC_API_BASE_URL) is not set",
    );
    return NextResponse.json(
      { message: "Proxy misconfigured: backend URL not set" },
      { status: 500 },
    );
  }

  const targetPath = resolveTargetPath(pathSegments);
  const targetUrl = targetPath && isAllowed(method, targetPath)
    ? buildTargetUrl(method, targetPath, req.nextUrl.search)
    : null;
  if (!targetPath || !targetUrl) {
    reportAdminProbe(method, pathSegments, getClientIp(req.headers), req.headers.get("user-agent"));
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  // Selain GET, request harus datang dari axios client kita (lihat CSRF_HEADER)
  if (method !== "GET" && req.headers.get(CSRF_HEADER) !== CSRF_HEADER_VALUE) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  // Sudah divalidasi (net.isIP) atau "unknown" — lihat src/lib/clientIp.ts untuk syarat di edge proxy
  const clientIp = getClientIp(req.headers);

  if (method === "POST" && TURNSTILE_PATHS.has(targetPath) && isTurnstileEnabled()) {
    const remoteIp = clientIp === UNKNOWN_CLIENT_IP ? undefined : clientIp;
    const passed = await verifyTurnstile(req.headers.get(TURNSTILE_HEADER), remoteIp);
    if (!passed) {
      return NextResponse.json({ message: "captcha verification failed" }, { status: 403 });
    }
  }

  const isGoogleExchange = targetPath === GOOGLE_EXCHANGE_PATH;

  try {
    // Forward headers (strip host, add forward info)
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (method === "POST" && SITE_URL) {
      headers["X-Forwarded-Origin"] = SITE_URL;
      headers["X-Forwarded-Referer"] = SITE_URL;
    }

    // Header sendiri, bukan X-Forwarded-For: backend memakai IP server ini untuk whitelist.
    // Selalu dikirim (kontrak H4): tanpa IP sah → "unknown", bukan dihilangkan.
    headers["X-Client-IP"] = clientIp;
    if (STOREFRONT_PROXY_SECRET) headers["X-Storefront-Key"] = STOREFRONT_PROXY_SECRET;
    // Browser pembeli (fetch server ini sendiri mengaku "node"); dipakai email lupa password.
    const clientUserAgent = req.headers.get("user-agent");
    if (clientUserAgent) headers["X-Client-User-Agent"] = clientUserAgent.slice(0, 512);

    if (isGoogleExchange) {
      const binding = readGoogleBinding(req);
      if (binding) headers["X-Google-Binding"] = binding;
    }

    // Kunci transaksi dari checkout di browser ini (cookie-nya hanya terkirim untuk transaksi ini)
    if (method === "GET" && TRANSACTION_READ.test(targetPath)) {
      const key = req.cookies.get(TRANSACTION_KEY_COOKIE)?.value;
      if (key) headers[TRANSACTION_KEY_HEADER] = key;
    }

    // Sesi dibaca dari cookie HttpOnly; header Authorization dari browser tidak dipakai lagi.
    // readSessionToken hanya mengembalikan token pembeli — token admin/NOC tidak pernah diteruskan.
    const buyerSession = readSessionToken(req);
    const session = PUBLIC_AUTH_PATHS.has(targetPath) ? null : buyerSession;
    // Cookie sesi berisi token yang bukan milik pembeli (admin, rusak) → dihapus di respons
    const rejectedSessionCookie = !buyerSession && hasSessionCookie(req);
    if (session) headers["Authorization"] = `Bearer ${session.token}`;

    let body: string | undefined;

    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      const rawBody = await req.json().catch(() => null);

      // BUKAN kontrol keamanan: "enkripsi" body ini memakai kunci yang dikirim ke browser
      // (CryptoProvider di layout), dan body polos tetap diterima. Siapa pun bisa membaca/membuat
      // payload-nya. Kerahasiaan datang dari HTTPS; validasi tetap di backend. Jangan diandalkan.
      if (rawBody && rawBody.payload) {
        const decrypted = decryptPayload(rawBody.payload);
        body = JSON.stringify(decrypted);
      } else if (rawBody) {
        // Body polos — diteruskan apa adanya
        body = JSON.stringify(rawBody);
      }
    }

    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    let data = await response.json().catch(() => null);

    // Login/daftar/Google berhasil: JWT tidak boleh sampai ke JavaScript halaman
    const issuedToken =
      response.ok && SESSION_ISSUING_PATHS.has(targetPath) && typeof data?.data?.token === "string"
        ? (data.data.token as string)
        : null;
    if (issuedToken) {
      const { token: _token, ...rest } = data.data;
      data = { ...data, data: rest };
    }

    // Kunci transaksi baru: tidak boleh sampai ke JavaScript halaman, pindah ke cookie HttpOnly
    let issuedTransactionKey: { id: string; key: string } | null = null;
    if (method === "POST" && targetPath === CHECKOUT_PATH && data?.data && typeof data.data === "object" && "access_key" in data.data) {
      const { access_key: accessKey, ...rest } = data.data;
      if (response.ok && typeof accessKey === "string" && accessKey && typeof rest.id === "string" && TRANSACTION_ID.test(rest.id)) {
        issuedTransactionKey = { id: rest.id, key: accessKey };
      }
      data = { ...data, data: rest };
    }

    // Teruskan Retry-After (429 lockout login) supaya client bisa menampilkan sisa waktu tunggu
    const retryAfter = response.headers.get("retry-after");

    const res = NextResponse.json(data, {
      status: response.status,
      headers: retryAfter ? { "Retry-After": retryAfter } : undefined,
    });

    const accountDeleted = response.ok && method === "DELETE" && targetPath === DELETE_ACCOUNT_PATH;

    if (issuedTransactionKey) {
      res.cookies.set(TRANSACTION_KEY_COOKIE, issuedTransactionKey.key, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: `/api/proxy/v1/transactions/${issuedTransactionKey.id}`,
        maxAge: TRANSACTION_KEY_MAX_AGE,
      });
    }

    if (issuedToken) {
      writeSession(res, issuedToken, data?.data?.user);
    } else if ((session && response.status === 401) || rejectedSessionCookie || accountDeleted) {
      // Sesi ditolak backend (kedaluwarsa/dicabut), cookie bukan token pembeli, atau akun baru dihapus
      // → hapus juga cookie HttpOnly yang tidak bisa dihapus JS
      clearSession(res);
    } else if (session) {
      // Akun email belum punya foto; setelah link Google, backend mengisinya → perbarui avatar navbar
      const avatarUrl = data?.data?.avatar_url;
      const cookieUser = readCookieUser(req);
      if (
        response.ok &&
        targetPath === "v1/auth/google/link" &&
        typeof avatarUrl === "string" &&
        avatarUrl &&
        cookieUser &&
        !cookieUser.picture
      ) {
        writeUser(res, session.token, { ...cookieUser, picture: avatarUrl });
      }
    }

    // Nonce Google sekali pakai, berhasil maupun gagal
    if (isGoogleExchange) clearGoogleBinding(res);

    return res;
  } catch (error) {
    console.error("[Proxy Error]", {
      backendUrl: BACKEND_URL,
      path: targetPath,
      error: error instanceof Error ? error.message : String(error),
    });
    const res = NextResponse.json({ message: "Proxy error" }, { status: 500 });
    if (isGoogleExchange) clearGoogleBinding(res);
    return res;
  }
}
