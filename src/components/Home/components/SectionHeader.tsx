'use client'

import { useTranslations } from 'next-intl'
import { ShowBadge, ShowBadgeVariant } from './ShowBadge'

interface SectionHeaderProps {
  title: string
  count: number
  badge?: ShowBadgeVariant | null
}

/** Header section: aksen bar gradient + judul + badge show + jumlah game. */
export function SectionHeader({ title, count, badge }: SectionHeaderProps) {
  const t = useTranslations('Home')

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span aria-hidden className="h-7 w-1 shrink-0 rounded-full bg-gradient-brand" />
      <h2 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
      {badge && <ShowBadge variant={badge} />}
      <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        {t('gamesCount', { count })}
      </span>
    </div>
  )
}
