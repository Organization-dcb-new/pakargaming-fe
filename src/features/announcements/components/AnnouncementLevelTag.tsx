'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/cn'
import { LEVEL_STYLE } from '@/features/announcements/styles'
import type { AnnouncementLevel } from '@/features/announcements/types/announcement'

/**
 * Chip level (jajar genjang seperti StatusBadge): ikon + label, bukan warna saja.
 * `compact`: di layar kecil label hanya untuk pembaca layar, supaya bar tetap satu baris.
 */
export default function AnnouncementLevelTag({
  level,
  compact = false,
}: {
  level: AnnouncementLevel
  compact?: boolean
}) {
  const t = useTranslations('Announcements')
  const { Icon, labelKey, tag } = LEVEL_STYLE[level]

  return (
    <span
      className={cn(
        'inline-flex h-6 shrink-0 -skew-x-12 items-center rounded-sm px-2 text-xs font-bold',
        tag,
      )}
    >
      <span className="inline-flex skew-x-12 items-center gap-1">
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className={compact ? 'max-sm:sr-only' : undefined}>{t(labelKey)}</span>
      </span>
    </span>
  )
}
