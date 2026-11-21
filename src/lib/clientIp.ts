import { isIP } from 'node:net'

/**
 * IP pembeli untuk rate limit per pembeli di backend (dikirim proxy sebagai `X-Client-IP`) dan untuk Turnstile.
 * Khusus server.
 *
 * Header yang dibaca diatur `CLIENT_IP_HEADER` (default `x-real-ip`). Header ini bisa dikarang siapa saja,
 * jadi nilainya hanya bisa dipercaya kalau:
 * 1. edge proxy di depan FE (nginx/Caddy di host) SELALU MENIMPA header itu dengan IP koneksi pembeli,
 *    mis. nginx: `proxy_set_header X-Real-IP $remote_addr;` — bukan meneruskan nilai dari pembeli; dan
 * 2. port 3000 container ini tidak bisa dijangkau langsung dari internet (compose: `127.0.0.1:3000:3000`),
 *    supaya tidak ada jalan yang melewati edge.
 * Lihat README bagian "Deploy".
 */

export const UNKNOWN_CLIENT_IP = 'unknown'

const DEFAULT_CLIENT_IP_HEADER = 'x-real-ip'

/** Nama header dari env, sudah dinormalisasi. Nama yang tidak sah → default (Headers.get akan error). */
export function clientIpHeaderName(): string {
  const configured = (process.env.CLIENT_IP_HEADER ?? '').trim().toLowerCase()
  return /^[a-z0-9-]+$/.test(configured) ? configured : DEFAULT_CLIENT_IP_HEADER
}

/** Nilai CLIENT_IP_HEADER diisi tapi bukan nama header yang sah (dipakai peringatan saat server start). */
export function isClientIpHeaderMisconfigured(): boolean {
  const configured = (process.env.CLIENT_IP_HEADER ?? '').trim()
  return configured !== '' && clientIpHeaderName() !== configured.toLowerCase()
}

/**
 * IP pembeli yang sudah divalidasi (`net.isIP`), atau `unknown`. Tidak pernah meneruskan nilai yang
 * bukan IP: backend menaruh semua `unknown` di satu bucket rate limit bersama.
 *
 * Untuk `x-forwarded-for` diambil entri PALING KANAN — entri yang ditambahkan edge kita sendiri.
 * Entri di kirinya dikirim pembeli dan bisa dikarang.
 */
export function getClientIp(headers: Headers): string {
  const header = clientIpHeaderName()
  const raw = headers.get(header)
  if (!raw) return UNKNOWN_CLIENT_IP

  const candidate = (header === 'x-forwarded-for' ? raw.split(',').pop() ?? '' : raw).trim()
  return isIP(candidate) ? candidate : UNKNOWN_CLIENT_IP
}
