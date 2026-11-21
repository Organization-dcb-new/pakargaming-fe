'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

interface ScheduleInfoProps {
  startTime: string | null
  endTime: string | null
}

const pad = (n: number) => String(n).padStart(2, '0')
const toMs = (iso: string | null) => (iso ? Date.parse(iso) : Number.NaN)

const tileHeight = 'h-20 sm:h-24'

/** Tile angka countdown. Border gradient lewat 2 lapis chamfer, karena clip-path ikut memotong border biasa. */
function TimeTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex max-w-24 min-w-0 flex-1 flex-col items-center gap-2">
      <div className="chamfer w-full bg-gradient-brand p-px [--chamfer:12px]">
        <div className={`chamfer flex items-center justify-center bg-card [--chamfer:11.5px] ${tileHeight}`}>
          <span className="font-display text-4xl font-bold tabular-nums text-foreground sm:text-5xl">
            {value}
          </span>
        </div>
      </div>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

/** Tanpa end_time: bar indeterminate + pesan, tanpa countdown. */
function NoEstimate() {
  const t = useTranslations('Maintenance')

  return (
    <div className="space-y-4">
      <div
        role="progressbar"
        aria-label={t('progress')}
        aria-valuetext={t('noEstimate')}
        className="h-2 overflow-hidden rounded-full bg-muted"
      >
        <div className="h-full w-2/5 rounded-full bg-gradient-brand animate-[maintenance-indeterminate_1.8s_ease-in-out_infinite] motion-reduce:animate-none" />
      </div>
      <div className="space-y-1">
        <p className="font-display text-lg font-bold text-foreground">{t('noEstimate')}</p>
        <p className="text-sm text-muted-foreground">{t('noEstimateHint')}</p>
      </div>
    </div>
  )
}

export default function ScheduleInfo({ startTime, endTime }: ScheduleInfoProps) {
  const t = useTranslations('Maintenance')
  const locale = useLocale()
  const router = useRouter()
  // null sampai mount: waktu & zona waktu browser bisa beda dengan server (cegah hydration mismatch)
  const [now, setNow] = useState<number | null>(null)
  const refreshedRef = useRef(false)

  const start = toMs(startTime)
  const end = toMs(endTime)
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

  if (!hasEnd) return <NoEstimate />

  const done = remaining !== null && remaining <= 0
  const total = remaining === null ? null : Math.max(0, Math.floor(remaining / 1000))
  const days = total === null ? 0 : Math.floor(total / 86400)
  const digits = (n: number) => (total === null ? '--' : pad(n))

  const tiles = [
    ...(days > 0 ? [{ key: 'd', value: digits(days), label: t('unitDays') }] : []),
    { key: 'h', value: digits(Math.floor(((total ?? 0) % 86400) / 3600)), label: t('unitHours') },
    { key: 'm', value: digits(Math.floor(((total ?? 0) % 3600) / 60)), label: t('unitMinutes') },
    { key: 's', value: digits((total ?? 0) % 60), label: t('unitSeconds') },
  ]

  // Progres butuh start_time yang valid; bar tetap dirender sebelum mount (0%) supaya tidak geser layout
  const hasProgress = !Number.isNaN(start) && start < end
  const percent =
    now === null || !hasProgress
      ? 0
      : Math.floor(Math.min(1, Math.max(0, (now - start) / (end - start))) * 100)

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

  return (
    <div className="space-y-8">
      <div role="timer" aria-label={t('endsIn')} className="flex items-start justify-center gap-2 sm:gap-3">
        {tiles.map((tile, i) => (
          <Fragment key={tile.key}>
            {i > 0 && (
              <span
                aria-hidden="true"
                className={`flex items-center font-display text-3xl font-bold text-primary sm:text-4xl ${tileHeight}`}
              >
                :
              </span>
            )}
            <TimeTile value={tile.value} label={tile.label} />
          </Fragment>
        ))}
      </div>

      <div className="space-y-3">
        {hasProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <span id="maintenance-progress-label">{t('progress')}</span>
              <span className="font-display text-sm tabular-nums text-primary">
                {now === null ? '—' : `${percent}%`}
              </span>
            </div>
            <div
              role="progressbar"
              aria-labelledby="maintenance-progress-label"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              className="h-2 overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-gradient-brand transition-[width] duration-1000 ease-linear motion-reduce:transition-none"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}

        <p aria-live="polite" className="text-sm text-balance text-muted-foreground">
          {done ? (
            <span className="font-semibold text-primary">{t('almostDone')}</span>
          ) : (
            <>
              {t('estimatedEnd')}: <span className="font-semibold text-foreground">{endLabel}</span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
