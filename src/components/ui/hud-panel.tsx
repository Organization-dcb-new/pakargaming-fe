import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface HudPanelProps {
  children: ReactNode
  /** Kelas untuk lapis luar (lebar, margin, dsb.) */
  className?: string
  /** Kelas untuk isi panel (padding, layout) */
  innerClassName?: string
}

/**
 * Panel HUD: sudut kiri-atas & kanan-bawah terpotong (chamfer), garis tepi 1px, dan aksen gradient brand
 * di atas. Garis dibuat dua lapis karena clip-path ikut memotong border biasa. Dipakai kartu halaman
 * (reset password, dsb.); dialog memakai gaya yang sama lewat className DialogContent.
 */
export function HudPanel({ children, className, innerClassName }: HudPanelProps) {
  return (
    <div className={cn('chamfer bg-border p-px [--chamfer:20px]', className)}>
      <div className={cn('chamfer relative bg-card [--chamfer:19.6px]', innerClassName)}>
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-brand" />
        {children}
      </div>
    </div>
  )
}
