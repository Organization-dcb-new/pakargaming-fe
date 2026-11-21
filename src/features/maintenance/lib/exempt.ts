/**
 * Header yang diisi src/proxy.ts dengan path halaman, supaya layout (server component, tidak tahu
 * path-nya sendiri) bisa memilih halaman yang tetap terbuka saat maintenance.
 */
export const PATHNAME_HEADER = 'x-pg-pathname'

/**
 * Halaman yang tetap terbuka saat maintenance (review SF2, 18 Nov 2026): pembeli yang sedang membayar
 * tetap melihat QR/VA dan status pesanannya, dan tetap bisa mengecek transaksinya. Dulu maintenance
 * menutup semua halaman, sehingga QR/VA hilang di tengah pembayaran. Checkout baru tetap ditolak
 * backend (503) selama maintenance.
 */
const EXEMPT = /^\/(?:(?:id|en)\/)?(?:detail-trx\/[^/]+|check-transaction)\/?$/

export function isMaintenanceExempt(pathname: string | null | undefined): boolean {
  return EXEMPT.test(pathname || '')
}
