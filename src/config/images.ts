/**
 * Host gambar remote yang dioptimasi next/image (resize sesuai layar + WebP/AVIF).
 * Dipakai `next.config.ts` (images.remotePatterns) dan `canOptimize()` di src/lib/image.ts.
 *
 * Gambar dari host lain tetap tampil, hanya tanpa optimasi — jadi data dari host baru tidak
 * membuat halaman error. Tambahkan host production di sini supaya gambarnya ikut dioptimasi.
 * Pola: `**.domain.com` = semua subdomain (sintaks remotePatterns Next.js).
 */
export const OPTIMIZED_IMAGE_HOSTS = [
  'res.cloudinary.com',
  's3.nevaobjects.id',
  '**.digitaloceanspaces.com',
] as const
