import { NextResponse } from 'next/server'
import { getActiveAnnouncements } from '@/features/announcements/lib/announcements'

export const dynamic = 'force-dynamic'

// Di-poll oleh AnnouncementCenter; datanya dari cache server, jadi tidak membebani backend.
export async function GET() {
  const announcements = await getActiveAnnouncements()
  return NextResponse.json({ announcements }, { headers: { 'Cache-Control': 'no-store' } })
}
