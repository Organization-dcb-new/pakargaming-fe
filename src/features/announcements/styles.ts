import { Gift, Megaphone, TriangleAlert, type LucideIcon } from 'lucide-react'
import type { AnnouncementLevel } from '@/features/announcements/types/announcement'

/**
 * Satu sumber warna per level (token tema, aman di dark & light):
 * info = cyan brand (primary), warning = amber (warning), promo = ungu logo (brand).
 * `tag` chip level · `tint` latar bar · `edge` garis bawah bar · `accent` garis atas & penanda judul popup.
 */
export const LEVEL_STYLE: Record<
  AnnouncementLevel,
  {
    Icon: LucideIcon
    labelKey: 'levelInfo' | 'levelWarning' | 'levelPromo'
    tag: string
    tint: string
    edge: string
    accent: string
  }
> = {
  info: {
    Icon: Megaphone,
    labelKey: 'levelInfo',
    tag: 'bg-primary text-primary-foreground',
    tint: 'bg-primary/10',
    edge: 'border-primary/30',
    accent: 'before:bg-primary',
  },
  warning: {
    Icon: TriangleAlert,
    labelKey: 'levelWarning',
    tag: 'bg-warning text-warning-foreground',
    tint: 'bg-warning/15',
    edge: 'border-warning/40',
    accent: 'before:bg-warning',
  },
  promo: {
    Icon: Gift,
    labelKey: 'levelPromo',
    tag: 'bg-brand-solid text-brand-solid-foreground',
    tint: 'bg-brand/10',
    edge: 'border-brand/30',
    accent: 'before:bg-gradient-brand',
  },
}
