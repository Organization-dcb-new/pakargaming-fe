import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'
import { LEGACY_TOKEN_COOKIE, SESSION_COOKIE } from './lib/session'

const intlMiddleware = createMiddleware(routing)

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Cookie lama tetap dihitung sampai proxy API memigrasikannya ke cookie HttpOnly
  const hasSession =
    request.cookies.has(SESSION_COOKIE) || request.cookies.has(LEGACY_TOKEN_COOKIE)

  const protectedRoute = /^\/(id|en)?\/(my-transaction|dashboard)/

  if (protectedRoute.test(pathname) && !hasSession) {
    const locale = pathname.startsWith('/en') ? 'en' : 'id'

    const redirectUrl = new URL(`/${locale}`, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return intlMiddleware(request)
}

export const config = {
  // Semua path kecuali API, aset Next.js, dan file statis (yang mengandung titik) — matcher standar next-intl.
  // Path tanpa prefix bahasa (mis. /abc) ikut di-redirect ke /id/abc, jadi dapat halaman 404 yang sudah dilokalkan.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
