'use client'

import { PaymentDataWithDetailProduct } from '@/types/transaction'
import { normalizeTransactionStatus } from '@/components/ui/status-badge'
import CheckoutView from './CheckoutView'
import PaymentFAQ from './PaymentFAQ'
import StatusView from './StatusView'

/**
 * Tampilan detail transaksi — layout adaptif per status (desain referensi "Neon Arena"):
 * PENDING → checkout (instruksi bayar), PAID/FAILED → kartu status.
 * FAQ pembayaran hanya relevan sebelum transaksi berhasil.
 */
export default function TransactionDetailView({ data }: { data: PaymentDataWithDetailProduct }) {
  const status = normalizeTransactionStatus(data.status)

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 md:gap-12 md:py-12 lg:px-8">
      {status === 'pending' ? (
        <CheckoutView data={data} />
      ) : (
        <StatusView data={data} paid={status === 'paid'} />
      )}

      {status !== 'paid' ? (
        <PaymentFAQ
          className={`mx-auto w-full ${status === 'pending' ? 'max-w-5xl' : 'max-w-2xl'}`}
        />
      ) : null}
    </div>
  )
}
