import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get('token')?.value

  const protectedRoute = /^\/(id|en)?\/my-transaction/

  if (protectedRoute.test(pathname) && !token) {
    const locale = pathname.startsWith('/en') ? 'en' : 'id'

    const redirectUrl = new URL(`/${locale}`, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/', '/(id|en)/:path*'],
}
