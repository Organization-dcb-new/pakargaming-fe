'use client'

import { useState } from 'react'
import { Loader2, Search, XCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useGetTransactionByPaymentNumber } from './hooks/useGetTransaction'
import TransactionResultCard, { TransactionResultSkeleton } from './components/TransactionResultCard'
import RecentTransactions from './components/RecentTransactions'

export default function CheckTransaction() {
  const t = useTranslations('CheckTransaction')
  const [invoice, setInvoice] = useState('')
  const [trxId, setTrxId] = useState('')

  const { data, isLoading } = useGetTransactionByPaymentNumber(trxId)

  const regex = /^PAY-\d{10,}$/
  const isValid = regex.test(invoice)
  const showError = invoice.length > 0 && !isValid

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setTrxId(invoice)
  }

  const transaction = data?.data
  // Hook tidak mengekspos isError: query selesai tanpa data = tidak ditemukan / gagal (toast dari hook)
  const notFound = !!trxId && !isLoading && !transaction?.id

  return (
    // Tinggi = viewport − navbar (h-14 / md:h-16, lihat Navigation/LayoutTop.tsx) → konten pas di tengah layar
    <section className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-3xl flex-col justify-center px-4 py-10 sm:px-6 md:min-h-[calc(100dvh-4rem)]">
      <div className="flex flex-col gap-6">
        <header className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('title')}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">{t('subtitle')}</p>
        </header>

        <form onSubmit={handleSubmit} noValidate className="space-y-2">
          <label htmlFor="invoice" className="sr-only">
            {t('inputLabel')}
          </label>
          <div className="flex flex-wrap gap-2.5">
            <input
              id="invoice"
              type="text"
              inputMode="text"
              autoComplete="off"
              value={invoice}
              onChange={(e) => setInvoice(e.target.value.toUpperCase().trim())}
              placeholder={t('placeholder')}
              aria-invalid={showError}
              aria-describedby={showError ? 'invoice-error' : 'invoice-hint'}
              className={`h-12 min-w-0 flex-[1_1_10rem] rounded-lg border bg-card px-4 font-display text-base font-semibold uppercase tracking-wider text-foreground outline-none transition-colors duration-200 placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground focus:ring-2 motion-reduce:transition-none ${
                showError
                  ? 'border-destructive focus:ring-destructive/30'
                  : 'border-border hover:border-primary/50 focus:border-primary focus:ring-ring/30'
              }`}
            />
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="chamfer flex h-12 flex-none cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-7 text-base font-bold text-primary-foreground transition-colors duration-200 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />
              ) : (
                <Search className="h-4 w-4" aria-hidden />
              )}
              {isLoading ? t('btnSearching') : t('btnSearch')}
            </button>
          </div>

          {showError ? (
            <p id="invoice-error" role="alert" className="text-sm font-medium text-destructive">
              {t('formatError')}
            </p>
          ) : (
            <p id="invoice-hint" className="text-xs text-muted-foreground">
              {t('exampleHint')}{' '}
              <code className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground">
                PAY-1770XXXXXXXXXXX
              </code>
            </p>
          )}
        </form>

        <div aria-live="polite">
          {isLoading && <TransactionResultSkeleton />}
          {!isLoading && transaction?.id && <TransactionResultCard transaction={transaction} />}
          {notFound && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm font-semibold text-foreground"
            >
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden />
              {t('notFound')}
            </div>
          )}
        </div>

        <RecentTransactions />
      </div>
    </section>
  )
}
