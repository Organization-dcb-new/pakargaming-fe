'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, Receipt, Search } from 'lucide-react'
import { useGetTransactionByPaymentNumber } from './hooks/useGetTransaction'
import { useRouter } from '../../i18n/routing'
import { useTranslations } from 'next-intl'

export default function CheckTransaction() {
  const t = useTranslations('CheckTransaction')
  const [invoice, setInvoice] = useState('')
  const [trxId, setTrxId] = useState('')
  const router = useRouter()

  const { data, isLoading } = useGetTransactionByPaymentNumber(trxId)

  const regex = /^PAY-\d{10,}$/
  const isValid = regex.test(invoice)
  const showError = invoice.length > 0 && !isValid

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setTrxId(invoice)
  }

  useEffect(() => {
    if (data?.data?.id) {
      router.push(`/detail-trx/${data.data.id}`)
    }
  }, [data, router])

  const features = [t('feature1'), t('feature2'), t('feature3')]

  return (
    <section className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden px-4 py-16 sm:py-20">
      {/* Subtle brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-10 md:grid-cols-2 lg:gap-16">
        {/* Hero */}
        <div>
          <span className="inline-flex items-center rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
            {t('eyebrow')}
          </span>

          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            {t('heroBefore')} <span className="text-brand">{t('heroHighlight')}</span>{' '}
            {t('heroAfter')}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t('heroBody')}</p>

          <ul className="mt-6 flex flex-col gap-2.5">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-6 text-sm text-muted-foreground">
            {t('exampleHint')}{' '}
            <code className="rounded-md border border-border bg-muted/50 px-2 py-0.5 font-mono text-xs font-medium text-foreground">
              PAY-1770XXXXXXXXXXX
            </code>
          </div>
        </div>

        {/* Form card */}
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-1 rounded-2xl bg-brand/20 opacity-40 blur-xl"
          />

          <div className="relative rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
            <h2 className="mb-6 text-lg font-semibold text-foreground">{t('formTitle')}</h2>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <label htmlFor="invoice" className="block text-sm font-medium text-foreground">
                  {t('inputLabel')}
                </label>

                <div className="relative">
                  <Receipt
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <input
                    id="invoice"
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    value={invoice}
                    onChange={(e) => setInvoice(e.target.value.toUpperCase().trim())}
                    placeholder={t('placeholder')}
                    aria-invalid={showError}
                    aria-describedby={showError ? 'invoice-error' : undefined}
                    className={`w-full rounded-xl border bg-background py-3 pl-10 pr-4 font-mono text-sm text-foreground transition-colors placeholder:font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 ${
                      showError ? 'border-destructive focus:ring-destructive/30' : 'border-border focus:border-brand'
                    }`}
                  />
                </div>

                {showError && (
                  <p id="invoice-error" role="alert" className="text-sm text-destructive">
                    {t('formatError')}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand py-3 font-semibold text-white shadow-lg shadow-brand/20 transition-all duration-200 hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    {t('btnSearching')}
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" aria-hidden />
                    {t('btnSearch')}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
