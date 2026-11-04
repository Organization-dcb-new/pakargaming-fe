/**
 * Crossfade seluruh halaman (View Transitions API) untuk perubahan global: ganti tema & bahasa.
 * Browser tanpa dukungan atau user dengan prefers-reduced-motion → perubahan langsung, tanpa animasi.
 * Durasi crossfade diatur di theme.css (`::view-transition-*`).
 */

let entranceSuppressed = false

/**
 * True selama ganti bahasa. Layout root ada di segmen `[locale]`, jadi seluruh pohon komponen
 * mount ulang — komponen dengan animasi masuk (mis. Reveal) sebaiknya langsung tampil.
 */
export function isEntranceSuppressed() {
  return entranceSuppressed
}

export function setEntranceSuppressed(value: boolean) {
  entranceSuppressed = value
}

/** Jalankan `update` (yang mengubah DOM) di dalam crossfade; resolve setelah animasi selesai. */
export async function startPageTransition(update: () => void | Promise<void>) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (typeof document.startViewTransition !== 'function' || reduceMotion) {
    await update()
    return
  }
  await document.startViewTransition(update).finished.catch(() => {})
}

/**
 * Resolve saat `<html lang>` sudah berganti ke `locale` (layout locale baru ter-render).
 * Dibatasi `timeoutMs` supaya halaman tidak "membeku" kalau navigasi gagal — selama callback
 * View Transition berjalan, browser menahan render.
 */
export function waitForDocumentLang(locale: string, timeoutMs = 2500) {
  return new Promise<void>((resolve) => {
    const root = document.documentElement
    if (root.lang === locale) return resolve()

    const finish = () => {
      observer.disconnect()
      clearTimeout(timer)
      resolve()
    }
    const observer = new MutationObserver(() => {
      if (root.lang === locale) finish()
    })
    observer.observe(root, { attributes: true, attributeFilter: ['lang'] })
    const timer = setTimeout(finish, timeoutMs)
  })
}
