import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const isDev = process.env.NODE_ENV !== 'production'

/**
 * CSP yang ditegakkan sekarang: aman karena tidak membatasi script/gambar/koneksi apa pun yang dipakai situs.
 * - frame-ancestors: situs tidak bisa di-iframe situs lain (clickjacking)
 * - object-src: tidak ada plugin (Flash/applet) — vektor XSS lama
 * - base-uri: <base> sisipan tidak bisa membelokkan URL relatif
 */
const enforcedCsp = ["frame-ancestors 'self'", "object-src 'none'", "base-uri 'self'"].join('; ')

/**
 * CSP lengkap, masih Report-Only: pelanggaran hanya dicatat di console browser, tidak memblokir.
 * Pantau console di production (checkout, pembayaran, login Google, GA); setelah bersih, pindahkan
 * ke header `Content-Security-Policy`. 'unsafe-inline' masih perlu untuk script inline Next.js —
 * menggantinya dengan nonce butuh render dinamis per request.
 */
const reportOnlyCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  // QR/logo pembayaran & gambar game datang dari banyak host (gateway, CDN) → semua HTTPS diizinkan
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? ' ws:' : ''} https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`,
  'frame-src https://challenges.cloudflare.com',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ')

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Content-Security-Policy', value: enforcedCsp },
  { key: 'Content-Security-Policy-Report-Only', value: reportOnlyCsp },
  // Paksa HTTPS 1 tahun. Sengaja tanpa includeSubDomains: subdomain lain (blog, dev) belum tentu HTTPS semua.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
]

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  // Jangan umumkan "X-Powered-By: Next.js" ke pemindai otomatis
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  /**
   * Halaman lama yang sudah digantikan. Redirect permanen supaya link lama (bookmark, email,
   * return URL payment gateway) tetap jalan. Query string ikut terbawa otomatis.
   */
  async redirects() {
    return [
      { source: '/:locale(id|en)/transaction/:id', destination: '/:locale/detail-trx/:id', permanent: true },
      { source: '/transaction/:id', destination: '/detail-trx/:id', permanent: true },
      { source: '/:locale(id|en)/my-transaction', destination: '/:locale/dashboard', permanent: true },
      { source: '/my-transaction', destination: '/dashboard', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/ws/:path*',
        // Use http/https protocol for destination, Next.js will handle the WS upgrade automatically
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.pakargaming.id'}/v1/ws/:path*`,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 's3.nevaobjects.id',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
      {
        protocol: 'https',
        hostname: 'instagram.fcgk3-2.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
