import { NextRequest, NextResponse } from "next/server";
import { decryptPayload } from "@/lib/crypto";
import { CSRF_HEADER, CSRF_HEADER_VALUE, TURNSTILE_HEADER } from "@/lib/session";
import {
  clearSession,
  readCookieUser,
  readSessionToken,
  writeSession,
  writeUser,
} from "@/lib/sessionServer";
import { isTurnstileEnabled, verifyTurnstile } from "@/lib/turnstile";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const SITE_URL = process.env.NEXT_SITE_BASE_URL

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type RouteContext = { params: Promise<{ path: string[] }> };

/**
 * Endpoint backend yang boleh dipanggil browser lewat proxy ini — selain ini ditolak 404.
 * Backend hanya menerima request dari IP server FE (akses langsung dari internet dapat 403), jadi proxy
 * ini satu-satunya pintu dari luar: tanpa daftar ini endpoint internal/admin ikut terbuka.
 * Endpoint baru di FE → tambahkan di sini.
 */
const ALLOWED_ROUTES: ReadonlyArray<readonly [Method, RegExp]> = [
  ["GET", /^v1\/banners$/],
  ["GET", /^v1\/shows$/],
  ["GET", /^v1\/games(\/letter|\/search|\/slug\/[^/]+)?$/],
  ["GET", /^v1\/category-product\/by-game\/[^/]+$/],
  ["GET", /^v1\/payment-categories\/client$/],
  ["GET", /^v1\/referral-codes\/code\/[^/]+$/],
  ["POST", /^v1\/transactions(\/check-id)?$/],
  ["GET", /^v1\/transactions\/email\/dashboard$/],
  ["GET", /^v1\/transactions\/detail-trx\/[^/]+$/],
  ["GET", /^v1\/transactions\/[^/]+$/],
  ["POST", /^v1\/auth\/(login|register|forgot-password|reset-password)$/],
  ["GET", /^v1\/auth\/me$/],
  ["POST", /^v1\/auth\/google\/(exchange|link|link\/start)$/],
];

/** Endpoint publik: tidak pernah ditempeli sesi, dan 401 di sini berarti kredensial salah, bukan sesi habis. */
const PUBLIC_AUTH_PATHS = new Set([
  "v1/auth/login",
  "v1/auth/register",
  "v1/auth/forgot-password",
  "v1/auth/reset-password",
  "v1/auth/google/exchange",
]);

/** Respons berisi `{ token, user }` → token dipindah ke cookie HttpOnly dan dibuang dari body. */
const SESSION_ISSUING_PATHS = new Set([
  "v1/auth/login",
  "v1/auth/register",
  "v1/auth/google/exchange",
]);

/** Target favorit bot (tebak password, spam akun, spam email reset) → wajib lolos Turnstile kalau aktif. */
const TURNSTILE_PATHS = new Set([
  "v1/auth/login",
  "v1/auth/register",
  "v1/auth/forgot-password",
]);

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
 * Segmen sudah di-decode Next.js, jadi `%2e%2e`, `%2F`, `%3F` muncul sebagai `..`, `/`, `?`.
 * Ditolak supaya path tidak bisa keluar dari allowlist atau menyisipkan query sendiri.
 */
function resolveTargetPath(segments: string[]): string | null {
  for (const segment of segments) {
    if (!segment || segment === "." || segment === ".." || /[/\\?#]/.test(segment)) return null;
  }
  return segments.join("/");
}

function isAllowed(method: Method, path: string) {
  return ALLOWED_ROUTES.some(([allowedMethod, pattern]) => allowedMethod === method && pattern.test(path));
}

/**
 * IP pembeli untuk rate limit per pembeli di backend. Header ini bisa diisi siapa saja, jadi hanya akurat
 * kalau nginx di depan FE menimpanya: `proxy_set_header X-Real-IP $remote_addr;`.
 */
function getClientIp(req: NextRequest) {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  );
}

async function proxyRequest(req: NextRequest, pathSegments: string[], method: Method) {
  if (!BACKEND_URL) {
    console.error(
      "[Proxy Error] BACKEND_URL (NEXT_PUBLIC_API_BASE_URL) is not set",
    );
    return NextResponse.json(
      { message: "Proxy misconfigured: backend URL not set" },
      { status: 500 },
    );
  }

  const targetPath = resolveTargetPath(pathSegments);
  if (!targetPath || !isAllowed(method, targetPath)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  // Selain GET, request harus datang dari axios client kita (lihat CSRF_HEADER)
  if (method !== "GET" && req.headers.get(CSRF_HEADER) !== CSRF_HEADER_VALUE) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const clientIp = getClientIp(req);

  if (TURNSTILE_PATHS.has(targetPath) && isTurnstileEnabled()) {
    const passed = await verifyTurnstile(req.headers.get(TURNSTILE_HEADER), clientIp ?? undefined);
    if (!passed) {
      return NextResponse.json({ message: "captcha verification failed" }, { status: 403 });
    }
  }

  try {
    const search = req.nextUrl.search;
    const targetUrl = `${BACKEND_URL}/${targetPath}${search}`;

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
    if (clientIp) headers["X-Client-IP"] = clientIp;

    // Sesi dibaca dari cookie HttpOnly; header Authorization dari browser tidak dipakai lagi.
    const session = PUBLIC_AUTH_PATHS.has(targetPath) ? null : readSessionToken(req);
    if (session) headers["Authorization"] = `Bearer ${session.token}`;

    let body: string | undefined;

    // Decrypt payload for mutating methods
    if (["POST", "PUT", "PATCH"].includes(method)) {
      const rawBody = await req.json().catch(() => null);

      if (rawBody && rawBody.payload) {
        // Encrypted payload — decrypt it
        const decrypted = decryptPayload(rawBody.payload);
        body = JSON.stringify(decrypted);
      } else if (rawBody) {
        // Non-encrypted payload — forward as-is (fallback)
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

    // Teruskan Retry-After (429 lockout login) supaya client bisa menampilkan sisa waktu tunggu
    const retryAfter = response.headers.get("retry-after");

    const res = NextResponse.json(data, {
      status: response.status,
      headers: retryAfter ? { "Retry-After": retryAfter } : undefined,
    });

    if (issuedToken) {
      writeSession(res, issuedToken, data?.data?.user);
    } else if (session && response.status === 401) {
      // Sesi ditolak backend (kedaluwarsa/dicabut) → hapus juga cookie HttpOnly yang tidak bisa dihapus JS
      clearSession(res);
    } else if (session) {
      if (session.legacy) {
        // Pengguna yang login sebelum migrasi: pindahkan token dari cookie lama ke cookie HttpOnly
        writeSession(res, session.token, readCookieUser(req));
      }

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

    return res;
  } catch (error) {
    console.error("[Proxy Error]", {
      backendUrl: BACKEND_URL,
      path: targetPath,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ message: "Proxy error" }, { status: 500 });
  }
}
