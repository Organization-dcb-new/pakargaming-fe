import { NextRequest, NextResponse } from 'next/server'
import { CSRF_HEADER, CSRF_HEADER_VALUE } from '@/lib/session'
import { clearSession } from '@/lib/sessionServer'

/** Cookie sesi HttpOnly tidak bisa dihapus JavaScript, jadi logout di browser memanggil endpoint ini. */
export async function POST(req: NextRequest) {
  if (req.headers.get(CSRF_HEADER) !== CSRF_HEADER_VALUE) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  const res = NextResponse.json({ success: true })
  clearSession(res)
  return res
}
