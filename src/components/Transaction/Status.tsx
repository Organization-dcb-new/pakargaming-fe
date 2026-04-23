'use client'

import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Props {
  status: 'pending' | 'success' | 'failed'
}

export default function TransactionStatus({ status }: Props) {
  const t = useTranslations('Orders')

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center text-center gap-3">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <h2 className="text-xl font-bold text-green-600">{t('simpleSuccessTitle')}</h2>
        <p className="text-sm text-gray-500">{t('simpleSuccessDesc')}</p>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="flex flex-col items-center text-center gap-3">
        <XCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-xl font-bold text-red-600">{t('simpleFailedTitle')}</h2>
        <p className="text-sm text-gray-500">{t('simpleFailedDesc')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center text-center gap-3">
      <Clock className="w-16 h-16 text-yellow-500 animate-pulse" />
      <h2 className="text-xl font-bold text-yellow-600">{t('simplePendingTitle')}</h2>
      <p className="text-sm text-gray-500">{t('simplePendingDesc')}</p>
    </div>
  )
}
