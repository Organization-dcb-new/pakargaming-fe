'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import FaqPanel, { type FaqItem } from '@/components/FaqPanel'

/** FAQ pembayaran di detail transaksi — panel & akordeon dari components/FaqPanel (sama dengan FAQ halaman top-up). */
export default function PaymentFAQ({ className = '' }: { className?: string }) {
  const t = useTranslations('DetailTrx')

  const items = useMemo<FaqItem[]>(
    () => [
      {
        question: t('faq1q'),
        answer: (
          <ul className="list-inside list-disc space-y-1">
            <li>{t('faq1Li1')}</li>
            <li>{t('faq1Li2')}</li>
            <li>{t('faq1Li3')}</li>
            <li>{t('faq1Li4')}</li>
          </ul>
        ),
      },
      { question: t('faq2q'), answer: t('faq2a') },
      { question: t('faq3q'), answer: t('faq3a') },
      {
        question: t('faq4q'),
        answer: (
          <div className="space-y-2">
            <p>{t('faq4P1')}</p>
            <ul className="list-inside list-disc space-y-1">
              <li>{t('faq4Li1')}</li>
              <li>{t('faq4Li2')}</li>
              <li>{t('faq4Li3')}</li>
              <li>{t('faq4Li4')}</li>
            </ul>
          </div>
        ),
      },
      { question: t('faq5q'), answer: t('faq5a') },
      {
        question: t('faq6q'),
        answer: (
          <div className="space-y-2">
            <p>{t('faq6P1')}</p>
            <ul className="list-inside list-disc space-y-1">
              <li>{t('faq6Li1')}</li>
              <li>{t('faq6Li2')}</li>
            </ul>
            <p>{t('faq6P2')}</p>
          </div>
        ),
      },
    ],
    [t],
  )

  return <FaqPanel id="payment-faq" title={t('faqTitle')} items={items} className={className} />
}
