'use client'

import { CheckCircle2, Clock, RotateCw, TriangleAlert, XCircle, type LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import { formatPrice } from '../../../utils/format_price'
import { focusRing, getAvatarSrc } from '../../Navigation/config'
import { PlayerAvatar } from '../../ui/player-avatar'
import { Skeleton } from '../../ui/skeleton'
import { cn } from '../../ui/utils'
import type { TransactionResponseDetail } from '../types/transactions'

interface PlayerCardProps {
  user: { name?: string; email?: string; picture?: string } | null
  stats?: TransactionResponseDetail
  isLoading: boolean
  isError: boolean
  isFetching: boolean
  onRetry: () => void
}

type Segment = { key: string; label: string; count: number; bar: string; text: string; Icon: LucideIcon }

/** Kartu "pemain": identitas + statistik HUD + bar segmen status transaksi. */
export default function PlayerCard({ user, stats, isLoading, isError, isFetching, onRetry }: PlayerCardProps) {
  const t = useTranslations('Dashboard')

  const segments: Segment[] = [
    {
      key: 'paid',
      label: t('statusLabelPaid'),
      count: stats?.transactions_paid ?? 0,
      bar: 'bg-success',
      text: 'text-success',
      Icon: CheckCircle2,
    },
    {
      key: 'pending',
      label: t('statusLabelPending'),
      count: stats?.transactions_pending ?? 0,
      bar: 'bg-pending',
      text: 'text-pending',
      Icon: Clock,
    },
    {
      key: 'failed',
      label: t('statusLabelFailed'),
      count: stats?.transactions_failed ?? 0,
      bar: 'bg-destructive',
      text: 'text-destructive',
      Icon: XCircle,
    },
  ]
  const segmentTotal = segments.reduce((sum, s) => sum + s.count, 0)

  return (
    <section
      aria-labelledby="player-name"
      className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      {/* Dekorasi: pita garis di atas + glow brand */}
      <div aria-hidden="true" className="bg-stripes pointer-events-none absolute inset-x-0 top-0 h-28" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-brand/15 blur-3xl"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-brand" />

      <div className="relative space-y-6 p-5 sm:p-8">
        {/* Identitas */}
        <div className="flex items-center gap-4 sm:gap-5">
          {user ? (
            <PlayerAvatar src={getAvatarSrc(user)} size="lg" />
          ) : (
            <Skeleton className="size-16 shrink-0 rounded-xl sm:size-24" />
          )}
          <div className="min-w-0 flex-1 space-y-1">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-primary">
              {t('welcome')}
            </p>
            {user ? (
              <>
                <h1
                  id="player-name"
                  className="truncate font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
                >
                  {user.name}
                </h1>
                <p className="truncate text-sm text-muted-foreground">{user.email}</p>
              </>
            ) : (
              <div className="space-y-2 pt-1">
                <Skeleton className="h-7 w-56 max-w-full rounded-md" />
                <Skeleton className="h-4 w-40 max-w-full rounded-md" />
              </div>
            )}
          </div>
        </div>

        <div aria-hidden="true" className="h-px bg-border" />

        {/* Statistik */}
        {isError ? (
          <div
            role="alert"
            className="flex flex-col items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 sm:flex-row sm:items-center"
          >
            <TriangleAlert className="size-5 shrink-0 text-destructive" aria-hidden="true" />
            <p className="flex-1 text-sm text-foreground">{t('errorState')}</p>
            <button
              type="button"
              onClick={onRetry}
              disabled={isFetching}
              className={cn(
                'inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none',
                focusRing,
              )}
            >
              <RotateCw
                className={cn('size-4', isFetching && 'animate-spin motion-reduce:animate-none')}
                aria-hidden="true"
              />
              {t('retry')}
            </button>
          </div>
        ) : (
          <div className="space-y-5" aria-busy={isLoading || undefined}>
            <dl className="grid grid-cols-2 gap-4 sm:gap-6">
              <HudStat
                label={t('statTotalTransactions')}
                value={stats?.total_transactions ?? 0}
                loading={isLoading}
              />
              <HudStat
                label={t('statTotalAmount')}
                value={`Rp ${formatPrice(stats?.total_amount ?? 0)}`}
                loading={isLoading}
                accent
              />
            </dl>

            <div className="space-y-3">
              <div
                role="img"
                aria-label={segments.map((s) => `${s.label} ${s.count}`).join(', ')}
                className="flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-muted"
              >
                {!isLoading &&
                  segmentTotal > 0 &&
                  segments
                    .filter((s) => s.count > 0)
                    .map((s) => (
                      <div key={s.key} className={s.bar} style={{ width: `${(s.count / segmentTotal) * 100}%` }} />
                    ))}
              </div>

              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {segments.map(({ key, label, count, text, Icon }) => (
                  <li key={key} className="flex items-center gap-2 text-sm">
                    <Icon className={cn('size-4 shrink-0', text)} aria-hidden="true" />
                    <span className="text-muted-foreground">{label}</span>
                    {isLoading ? (
                      <Skeleton className="h-4 w-5 rounded" />
                    ) : (
                      <span className="font-display font-bold tabular-nums text-foreground">{count}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function HudStat({
  label,
  value,
  loading,
  accent,
}: {
  label: string
  value: ReactNode
  loading: boolean
  accent?: boolean
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1">
        {loading ? (
          <Skeleton className="h-9 w-28 rounded-md" />
        ) : (
          <span
            className={cn(
              'block truncate font-display text-2xl font-bold tabular-nums sm:text-4xl',
              accent ? 'text-primary' : 'text-foreground',
            )}
          >
            {value}
          </span>
        )}
      </dd>
    </div>
  )
}
