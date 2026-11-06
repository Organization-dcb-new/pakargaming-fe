'use client'

import { ReactNode, useState } from 'react'
import Image from 'next/image'
import { Eye, EyeOff, Ticket } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { PaymentDataWithDetailProduct } from '../../../types/Transaction'
import { formatDateTime } from '../../../utils/format_date'
import { formatPrice } from '../../../utils/format_price'
import TransactionThumb from '../../Check-Transaction/components/TransactionThumb'
import { CopyButton } from '../../ui/copy-button'

function Row({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className={`min-w-0 text-right font-semibold text-foreground ${className}`}>{children}</dd>
    </div>
  )
}

/** Kode voucher (produk voucher): disembunyikan dulu, bisa ditampilkan & disalin. */
function VoucherCode({ code }: { code: string }) {
  const t = useTranslations('DetailTrx')
  const [visible, setVisible] = useState(false)
  const iconBtn =
    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-success/15 hover:text-foreground'

  return (
    <div className="rounded-xl border border-success/40 bg-success/10 p-3.5">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-success">
        <Ticket className="h-4 w-4" aria-hidden />
        {t('labelVoucher')}
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="min-w-0 break-all font-mono text-base font-semibold text-foreground">
          {visible ? code : '••••••••••••'}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? t('hideVoucher') : t('showVoucher')}
            aria-pressed={visible}
            className={`${iconBtn} cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none`}
          >
            {visible ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
          </button>
          <CopyButton
            value={code}
            successMessage={t('copyVoucher')}
            label={t('copyVoucherLabel')}
            className={`${iconBtn} justify-center`}
          />
        </div>
      </div>
    </div>
  )
}

/** Ringkasan pesanan: produk, akun/email, metode, tanggal, total. Dipakai di layout checkout & status. */
export default function OrderSummary({ data }: { data: PaymentDataWithDetailProduct }) {
  const t = useTranslations('DetailTrx')
  const locale = useLocale()
  const product = data.detail_product
  const voucher = product?.voucher_code?.trim()
  const method = product?.payment_name?.trim() || data.payment_channel

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex items-center gap-3">
        <TransactionThumb src={product?.item_image} name={product?.item_name} size="lg" />
        <div className="min-w-0 flex-1">
          {product?.category ? (
            <span className="chamfer inline-flex bg-brand/15 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-brand [--chamfer:5px]">
              {product.category}
            </span>
          ) : null}
          <p className="mt-1 font-display text-base font-bold leading-tight text-foreground">
            {product?.item_product || '—'}
          </p>
          {product?.item_name ? (
            <p className="truncate text-sm text-muted-foreground">{product.item_name}</p>
          ) : null}
        </div>
      </div>

      <dl className="flex flex-col gap-2.5">
        {product?.item_quantity ? <Row label={t('labelQuantity')}>{product.item_quantity}</Row> : null}
        {product?.email ? (
          <Row label={t('labelEmail')} className="break-all">
            {product.email}
          </Row>
        ) : null}
        <Row label={t('paymentMethodLabel')}>
          <span className="inline-flex items-center gap-2">
            {product?.payment_image ? (
              /* Logo pihak ketiga di atas chip putih supaya tetap terbaca di dark mode (rules §2.3) */
              <span className="inline-flex rounded bg-white px-1.5 py-0.5">
                <Image
                  src={product.payment_image}
                  alt=""
                  width={40}
                  height={16}
                  unoptimized
                  className="h-4 w-auto object-contain"
                />
              </span>
            ) : null}
            {method}
          </span>
        </Row>
        {data.created_at ? <Row label={t('labelDate')}>{formatDateTime(data.created_at, locale)}</Row> : null}
        <div className="flex items-baseline justify-between gap-4 border-t border-border pt-3">
          <dt className="font-semibold text-foreground">{t('labelTotal')}</dt>
          <dd className="font-display text-lg font-bold text-primary">Rp {formatPrice(data.amount)}</dd>
        </div>
      </dl>

      {voucher ? <VoucherCode code={voucher} /> : null}
    </div>
  )
}
