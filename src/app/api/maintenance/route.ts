import { NextResponse } from 'next/server'
import { getActiveMaintenance } from '@/lib/maintenance'

export const dynamic = 'force-dynamic'

// Di-poll oleh MaintenanceWatcher; datanya dari cache server, jadi tidak membebani backend.
export async function GET() {
  const active = await getActiveMaintenance()
  return NextResponse.json(
    { active: Boolean(active) },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
