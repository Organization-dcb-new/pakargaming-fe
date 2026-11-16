'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'
import { usePublicEnv } from '@/providers/PublicEnvProvider'

/**
 * Query param berisi kredensial (JWT sesi lama, token reset password / verifikasi email, kode & tiket
 * login/link Google): jangan pernah dikirim ke GA.
 */
const PRIVATE_PARAMS = ['token', 'user', 'auth_code', 'google_link', 'ticket', 'code', 'state', 'binding']

/**
 * Segmen path yang membuka data pembeli. Id di halaman bayar (/detail-trx/<id>) cukup untuk membuka
 * transaksi beserta kode vouchernya, jadi ke GA hanya dikirim bentuk umumnya.
 */
const PRIVATE_PATHS: ReadonlyArray<readonly [RegExp, string]> = [
  [/^((?:\/(?:id|en))?\/detail-trx)\/[^/?#]+/, '$1/[id]'],
  [/^((?:\/(?:id|en))?\/transaction)\/[^/?#]+/, '$1/[id]'],
]

/** Path + query yang aman dikirim ke GA: id pribadi diganti placeholder, param kredensial dibuang. */
function redact(pathname: string, search: string) {
  const path = PRIVATE_PATHS.reduce((p, [pattern, replacement]) => p.replace(pattern, replacement), pathname)
  const params = new URLSearchParams(search)
  PRIVATE_PARAMS.forEach((key) => params.delete(key))
  const query = params.toString()
  return query ? `${path}?${query}` : path
}

/** Referrer halaman pertama: kalau dari situs ini (mis. reload dari halaman bayar), ikut disamarkan. */
function initialReferrer() {
  if (!document.referrer) return ''
  try {
    const ref = new URL(document.referrer)
    if (ref.origin !== window.location.origin) return document.referrer
    return `${ref.origin}${redact(ref.pathname, ref.search)}`
  } catch {
    return ''
  }
}

type Gtag = (...args: unknown[]) => void

function gtagConfig(gaId: string, pageLocation: string, pagePath: string, referrer: string) {
  if (!gaId || typeof window === 'undefined') return true
  const g = (window as Window & { gtag?: Gtag }).gtag
  if (typeof g !== 'function') return false
  // `set` dulu: berlaku untuk SEMUA event berikutnya (termasuk event otomatis enhanced measurement),
  // bukan hanya page_view dari `config`. Tanpa page_location/page_referrer, gtag mengirim URL asli
  // browser — termasuk id halaman bayar dan query di atas.
  g('set', { page_location: pageLocation, page_referrer: referrer })
  g('config', gaId, { page_path: pagePath, page_location: pageLocation, page_referrer: referrer })
  return true
}

function GoogleAnalyticsInner({ gaId }: { gaId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  /** Halaman terakhir yang dilaporkan (sudah disamarkan) — jadi referrer navigasi client-side berikutnya. */
  const lastPage = useRef<{ location: string; referrer: string } | null>(null)

  useEffect(() => {
    if (!gaId) return
    const pagePath = redact(pathname, searchParams?.toString() ?? '')
    const pageLocation = `${window.location.origin}${pagePath}`
    const last = lastPage.current
    // Efek yang jalan ulang untuk halaman yang sama (StrictMode) memakai referrer yang sama
    const referrer = !last ? initialReferrer() : last.location === pageLocation ? last.referrer : last.location
    lastPage.current = { location: pageLocation, referrer }

    let cancelled = false
    let attempts = 0
    const maxAttempts = 80

    const tick = () => {
      if (cancelled || attempts++ > maxAttempts) return
      if (!gtagConfig(gaId, pageLocation, pagePath, referrer)) {
        requestAnimationFrame(tick)
      }
    }
    tick()
    return () => {
      cancelled = true
    }
  }, [gaId, pathname, searchParams])

  if (!gaId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        `}
      </Script>
    </>
  )
}

/** Id GA dari .env server (NEXT_PUBLIC_GA_MEASUREMENT_ID, lewat usePublicEnv); kosong = GA tidak dimuat. */
export function GoogleAnalytics() {
  const { gaMeasurementId } = usePublicEnv()
  if (!gaMeasurementId) return null
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner gaId={gaMeasurementId} />
    </Suspense>
  )
}
