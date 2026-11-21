/** Tanggal + jam sesuai locale aktif (rules §8: jangan 'id-ID' mati). Nilai tak valid dikembalikan apa adanya. */
export function formatDateTime(value: string | undefined | null, locale: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}
