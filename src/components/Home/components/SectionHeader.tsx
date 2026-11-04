'use client'

import { useTranslations } from 'next-intl'
import { ShowBadge, ShowBadgeVariant } from './ShowBadge'

interface SectionHeaderProps {
  title: string
  count: number
  badge?: ShowBadgeVariant | null
}

/** Header section: aksen miring gradient logo + judul (font display) + badge show + jumlah game. */
export function SectionHeader({ title, count, badge }: SectionHeaderProps) {
  const t = useTranslations('Home')

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span aria-hidden className="h-6 w-1.5 shrink-0 -skew-x-12 bg-gradient-brand" />
      <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h2>
      {badge && <ShowBadge variant={badge} />}
      <span className="ml-auto rounded-full border border-border bg-card px-2.5 py-0.5 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t('gamesCount', { count })}
      </span>
    </div>
  )
}
