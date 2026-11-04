'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

interface ScheduleInfoProps {
  name: string
  endTime: string | null
}

const pad = (n: number) => String(n).padStart(2, '0')

const labelClass = 'text-xs font-medium uppercase tracking-wide text-muted-foreground'

export default function ScheduleInfo({ name, endTime }: ScheduleInfoProps) {
  const t = useTranslations('Maintenance')
  const locale = useLocale()
  const router = useRouter()
  // null sampai mount: waktu & zona waktu browser bisa beda dengan server (cegah hydration mismatch)
  const [now, setNow] = useState<number | null>(null)
  const refreshedRef = useRef(false)

  const end = endTime ? Date.parse(endTime) : Number.NaN
  const hasEnd = !Number.isNaN(end)
  const remaining = now !== null && hasEnd ? end - now : null

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  // Hitung mundur habis → minta server cek ulang (sekali saja, cegah loop kalau jam browser beda)
  useEffect(() => {
    if (remaining !== null && remaining <= 0 && !refreshedRef.current) {
      refreshedRef.current = true
      router.refresh()
    }
  }, [remaining, router])

  const endLabel =
    now === null
      ? '—'
      : new Intl.DateTimeFormat(locale, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short',
        }).format(end)

  let countdown = '—'
  if (remaining !== null) {
    if (remaining <= 0) {
      countdown = t('almostDone')
    } else {
      const total = Math.floor(remaining / 1000)
      const days = Math.floor(total / 86400)
      const clock = `${pad(Math.floor((total % 86400) / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
      countdown = days > 0 ? `${t('days', { count: days })} ${clock}` : clock
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5 text-left shadow-sm">
      {name && <p className="text-sm font-semibold text-foreground">{name}</p>}

      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className={labelClass}>{t('estimatedEnd')}</dt>
          <dd className="mt-1 text-sm font-medium text-foreground">
            {hasEnd ? endLabel : t('noEstimate')}
          </dd>
        </div>

        {hasEnd && (
          <div>
            <dt className={labelClass}>{t('endsIn')}</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-brand">{countdown}</dd>
          </div>
        )}
      </dl>
    </div>
  )
}
