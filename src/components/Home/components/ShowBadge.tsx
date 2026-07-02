'use client'

import { useTranslations } from 'next-intl'
import { Flame, Sparkles, Star } from 'lucide-react'
import type { Show } from '../../../types/Show'

export type ShowBadgeVariant = 'popular' | 'new' | 'hot'

const VARIANT_CLASS: Record<ShowBadgeVariant, string> = {
  popular: 'bg-gradient-brand text-brand-foreground',
  new: 'bg-success text-success-foreground',
  hot: 'bg-warning text-warning-foreground',
}

const VARIANT_ICON: Record<ShowBadgeVariant, typeof Star> = {
  popular: Star,
  new: Sparkles,
  hot: Flame,
}

/** Prioritas badge mengikuti urutan flag lama di utils/ribbon: popular > new > hot. */
export function getShowBadgeVariant(show: Show): ShowBadgeVariant | null {
  if (show.is_popular) return 'popular'
  if (show.is_new) return 'new'
  if (show.is_hot) return 'hot'
  return null
}

interface ShowBadgeProps {
  variant: ShowBadgeVariant
  /** Ribbon hidup: sapuan kilau periodik (dipakai di tile game) */
  animated?: boolean
}

export function ShowBadge({ variant, animated = false }: ShowBadgeProps) {
  const t = useTranslations('Home')
  const Icon = VARIANT_ICON[variant]
  const label = {
    popular: t('badgePopular'),
    new: t('badgeNew'),
    hot: t('badgeHot'),
  }[variant]

  return (
    <span
      className={`relative inline-flex items-center gap-1 overflow-hidden rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide shadow-sm ${VARIANT_CLASS[variant]}`}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {label}
      {animated && (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent animate-[ribbon-shine_2.6s_ease-in-out_infinite] motion-reduce:animate-none"
        />
      )}
    </span>
  )
}
