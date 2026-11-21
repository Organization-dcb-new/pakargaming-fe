/** Jam operasional toko = WIB; teks pemberitahuan menuliskan "WIB" di belakang waktunya. */
const STORE_TIME_ZONE = 'Asia/Jakarta'

const dayKey = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: STORE_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)

/**
 * Waktu resume_at dalam WIB sesuai locale aktif (rules §8): hari ini → jam saja ("21.00"), selain itu
 * hari + tanggal + jam. Nilai tak valid → ''.
 */
export function formatResumeAt(iso: string, locale: string, now: number = Date.now()): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const sameDay = dayKey(date) === dayKey(new Date(now))
  return new Intl.DateTimeFormat(locale, {
    timeZone: STORE_TIME_ZONE,
    ...(sameDay ? {} : { weekday: 'long', day: 'numeric', month: 'long' }),
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
