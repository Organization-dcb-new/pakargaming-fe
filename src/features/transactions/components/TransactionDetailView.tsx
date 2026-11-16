'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { PaymentDataWithDetailProduct } from '@/types/transaction'
import { normalizeTransactionStatus } from '@/components/ui/status-badge'
import { CHECKOUT_EXIT_SECONDS, revealItem, revealPage } from '@/features/transactions/lib/statusReveal'
import CheckoutView from './CheckoutView'
import PaymentFAQ from './PaymentFAQ'
import StatusView from './StatusView'

type TransactionDetailViewProps = {
  data: PaymentDataWithDetailProduct
  /** Ambil ulang transaksi (tombol "Cek status pembayaran" saat masih menunggu). */
  onCheckStatus: () => Promise<unknown>
  checkingStatus: boolean
}

/**
 * Tampilan detail transaksi — layout adaptif per status (desain referensi "Neon Arena"):
 * PENDING → checkout (instruksi bayar), PAID/FAILED → kartu status.
 * FAQ pembayaran hanya relevan sebelum transaksi berhasil.
 *
 * Kalau status berubah selama halaman terbuka (hasil "Cek status pembayaran"), checkout memudar lalu
 * kartu status masuk berurutan (lib/statusReveal.ts). Membuka transaksi yang sudah selesai tidak beranimasi.
 */
export default function TransactionDetailView({ data, onCheckStatus, checkingStatus }: TransactionDetailViewProps) {
  const status = normalizeTransactionStatus(data.status)
  const reduceMotion = useReducedMotion()
  const [initialStatus] = useState(status)
  const statusChanged = status !== initialStatus
  const reveal = statusChanged && !reduceMotion

  useEffect(() => {
    if (!statusChanged) return
    // Tombol cek status ada di tengah halaman (terutama di mobile) — bawa kartu hasil ke layar.
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' })
  }, [statusChanged, reduceMotion])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={status}
          className="flex flex-col gap-8 md:gap-12"
          variants={revealPage}
          initial={reveal ? 'hidden' : false}
          animate="show"
          exit={{
            opacity: 0,
            y: 12,
            transition: { duration: reduceMotion ? 0 : CHECKOUT_EXIT_SECONDS, ease: 'easeIn' },
          }}
        >
          {status === 'pending' ? (
            <CheckoutView data={data} onCheckStatus={onCheckStatus} checkingStatus={checkingStatus} />
          ) : (
            <StatusView data={data} paid={status === 'paid'} focusTitle={statusChanged} />
          )}

          {status !== 'paid' ? (
            <motion.div variants={revealItem}>
              <PaymentFAQ
                className={`mx-auto w-full ${status === 'pending' ? 'max-w-5xl' : 'max-w-2xl'}`}
              />
            </motion.div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
