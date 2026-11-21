/**
 * Bentuk id/slug yang dipakai di path backend. Satu sumber untuk allowlist /api/proxy dan fetch
 * server (metadata halaman game), supaya nilai dari URL tidak bisa membelokkan path ke endpoint lain
 * (`..`, `%2e%2e`, `/`). Sengaja tanpa `.` dan `%`.
 */

/** UUID kanonik — id pembayaran (halaman bayar /detail-trx/:id) dan id game. */
export const UUID_PATTERN = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'

/** Slug game: helpers.GenerateSlug di backend (a-z, 0-9, -) + akhiran acak huruf besar/kecil. */
export const SLUG_PATTERN = '[A-Za-z0-9_-]{1,128}'

/** Nomor invoice: PG-261111-K7Q9X2MD (strip boleh hilang) atau format lama PAY-<angka>. */
export const INVOICE_PATTERN = '[A-Za-z0-9-]{1,64}'

/** Kode referral (dibuat admin, disimpan huruf besar). */
export const REFERRAL_CODE_PATTERN = '[A-Za-z0-9_-]{1,64}'

const GAME_SLUG = new RegExp(`^${SLUG_PATTERN}$`)

export function isGameSlug(value: string): boolean {
  return GAME_SLUG.test(value)
}
