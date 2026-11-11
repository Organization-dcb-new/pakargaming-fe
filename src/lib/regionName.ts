/** Nama negara dari kode region (`my` → "Malaysia") dalam bahasa aktif; jatuh ke `fallback`, lalu kodenya. */
export function regionName(code: string, locale: string, fallback?: string): string {
  const upper = code.toUpperCase()
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(upper) ?? fallback ?? upper
  } catch {
    return fallback ?? upper
  }
}
