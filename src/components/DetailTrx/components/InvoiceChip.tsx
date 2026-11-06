'use client'

import { useTranslations } from 'next-intl'
import { CopyButton } from '../../ui/copy-button'

/** "Invoice PAY-xxxx" yang bisa diklik untuk menyalin — nomor ini yang dipakai di halaman Cek Transaksi. */
export default function InvoiceChip({ value, className = '' }: { value: string; className?: string }) {
  const t = useTranslations('DetailTrx')

  return (
    <CopyButton
      value={value}
      successMessage={t('copyPaymentNumber')}
      label={t('copyInvoiceLabel')}
      className={`max-w-full rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground ${className}`}
    >
      <span className="min-w-0 break-all text-left">
        {t('invoiceLabel')} <strong className="font-semibold text-foreground">{value}</strong>
      </span>
    </CopyButton>
  )
}
