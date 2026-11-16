'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { RotateCcw, Search, ShoppingBag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { PaymentDataWithDetailProduct } from '@/types/transaction'
import { btnPrimary, btnSecondary } from '@/features/transactions/styles'
import {
  revealAccentBar,
  revealCard,
  revealGlyph,
  revealItem,
} from '@/features/transactions/lib/statusReveal'
import { HudPanel } from '@/components/ui/hud-panel'
import { STATE_GLYPH, StateGlyph } from '@/components/ui/state-glyph'
import { statusAccentClass, statusBorderClass } from '@/components/ui/status-badge'
import InvoiceChip from './InvoiceChip'
import OrderSummary from './OrderSummary'
import StatusTimeline from './StatusTimeline'

/**
 * Layout PAID / FAILED (referensi "status"): kolom tengah — ikon status, timeline, ringkasan, CTA.
 * Animasi masuknya dikendalikan pembungkus di TransactionDetailView (varian `show`/`hidden`).
 */
export default function StatusView({
  data,
  paid,
  focusTitle = false,
}: {
  data: PaymentDataWithDetailProduct
  paid: boolean
  /**
   * Pindahkan fokus ke judul saat muncul — dipakai ketika halaman berganti dari checkout, karena
   * tombol "Cek status" yang tadinya terfokus ikut hilang. Pembaca layar langsung membacakan hasilnya.
   */
  focusTitle?: boolean
}) {
  const t = useTranslations('DetailTrx')
  const tStatus = useTranslations('TransactionStatus')
  const slug = data.detail_product?.game_slug
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    // preventScroll: halaman sedang di-scroll halus ke atas oleh TransactionDetailView
    if (focusTitle) titleRef.current?.focus({ preventScroll: true })
  }, [focusTitle])

  return (
    <HudPanel
      as={motion.section}
      variants={revealCard}
      aria-labelledby="trx-status-title"
      accent={false}
      // Garis tepi & bilah atas mengikuti status: hijau = berhasil, merah = gagal
      borderClassName={statusBorderClass(data.status)}
      className="mx-auto w-full max-w-2xl"
      innerClassName="flex flex-col gap-6 overflow-hidden p-5 sm:p-8"
    >
      <motion.span
        aria-hidden
        variants={revealAccentBar}
        className={`absolute inset-x-0 top-0 h-1 origin-left ${statusAccentClass(data.status)}`}
      />
      <span aria-hidden className="bg-stripes pointer-events-none absolute inset-x-0 top-0 h-32" />

      <header className="relative flex flex-col items-center gap-3 text-center">
        <motion.span
          aria-hidden
          variants={revealGlyph}
          className={`chamfer flex h-20 min-w-20 items-center justify-center px-4 [--chamfer:14px] ${
            paid ? 'bg-success/15' : 'bg-destructive/15'
          }`}
        >
          <StateGlyph
            glyph={paid ? STATE_GLYPH.success : STATE_GLYPH.error}
            tone={paid ? 'success' : 'destructive'}
            size="md"
          />
        </motion.span>
        <motion.h1
          ref={titleRef}
          id="trx-status-title"
          tabIndex={-1}
          variants={revealItem}
          className="font-display text-2xl font-bold tracking-tight text-foreground outline-none sm:text-3xl"
        >
          {paid ? t('statusPaidTitle') : t('statusFailedTitle')}
        </motion.h1>
        <motion.p variants={revealItem} className="max-w-md text-base leading-relaxed text-muted-foreground">
          {paid ? tStatus('notePaid') : tStatus('noteFailed')}
        </motion.p>
        <motion.div variants={revealItem} className="flex max-w-full justify-center">
          <InvoiceChip value={data.payment_number} />
        </motion.div>
      </header>

      <motion.div variants={revealItem}>
        <StatusTimeline data={data} />
      </motion.div>

      <motion.div variants={revealItem} className="rounded-sm bg-muted/60 p-4">
        <OrderSummary data={data} />
      </motion.div>

      <motion.div variants={revealItem} className="flex flex-col gap-2.5 sm:flex-row">
        <Link href="/check-transaction" className={`${btnSecondary} sm:flex-1`}>
          <Search className="h-4 w-4" aria-hidden />
          {t('checkOtherTransaction')}
        </Link>
        {slug ? (
          <Link href={`/games/${slug}`} className={`${btnPrimary} sm:flex-1`}>
            {paid ? (
              <ShoppingBag className="h-4 w-4" aria-hidden />
            ) : (
              <RotateCcw className="h-4 w-4" aria-hidden />
            )}
            {paid ? tStatus('buyAgain') : tStatus('retryTransaction')}
          </Link>
        ) : null}
      </motion.div>
    </HudPanel>
  )
}
