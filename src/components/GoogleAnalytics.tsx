'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

function gtagConfig(pagePath: string) {
  if (!GA_ID || typeof window === 'undefined') return true
  const g = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof g !== 'function') return false
  g('config', GA_ID, { page_path: pagePath })
  return true
}

function GoogleAnalyticsInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_ID) return
    const query = searchParams?.toString()
    const pagePath = query ? `${pathname}?${query}` : pathname

    let cancelled = false
    let attempts = 0
    const maxAttempts = 80

    const tick = () => {
      if (cancelled || attempts++ > maxAttempts) return
      if (!gtagConfig(pagePath)) {
        requestAnimationFrame(tick)
      }
    }
    tick()
    return () => {
      cancelled = true
    }
  }, [pathname, searchParams])

  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
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

export function GoogleAnalytics() {
  if (!GA_ID) return null
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner />
    </Suspense>
  )
}
