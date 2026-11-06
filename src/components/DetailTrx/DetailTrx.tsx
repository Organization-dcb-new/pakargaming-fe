'use client'

import { PaymentDataWithDetailProduct } from '../../types/Transaction'
import { normalizeTransactionStatus } from '../ui/status-badge'
import CheckoutView from './components/CheckoutView'
import PaymentFAQ from './components/PaymentFAQ'
import StatusView from './components/StatusView'

/**
 * Halaman detail transaksi — layout adaptif per status (desain referensi "Neon Arena"):
 * PENDING → checkout (instruksi bayar), PAID/FAILED → kartu status.
 * FAQ pembayaran hanya relevan sebelum transaksi berhasil.
 */
export default function DetailTrx({ data }: { data: PaymentDataWithDetailProduct }) {
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
