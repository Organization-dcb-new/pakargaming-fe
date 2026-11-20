import { NextResponse } from 'next/server'
import { getTransactionStop } from '@/features/transaction-stop/lib/transactionStop'

export const dynamic = 'force-dynamic'

// Dibaca oleh useTransactionStop; datanya dari cache server, jadi tidak membebani backend.
export async function GET() {
  const { is_stopped, message, resume_at } = await getTransactionStop()
  return NextResponse.json(
    { is_stopped, message, resume_at },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
