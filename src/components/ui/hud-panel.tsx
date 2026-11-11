import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type HudPanelProps<T extends ElementType> = {
  /** Elemen pembungkus (default `div`) — mis. `section`, `aside`, `a`; atribut lain (id, aria-*, href) diteruskan ke sini. */
  as?: T
  children: ReactNode
  /** Kelas lapis luar (lebar, margin, display, `group`, dsb.) */
  className?: string
  /** Kelas isi panel (padding, layout) */
  innerClassName?: string
  /** Warna garis tepi (lapis luar), mis. 'bg-destructive' saat error atau 'group-hover:bg-primary/60' */
  borderClassName?: string
  /** Aksen gradient brand di tepi atas (default true) */
  accent?: boolean
  /** Ukuran potongan sudut */
  size?: 'md' | 'lg'
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

const SIZE = {
  md: { outer: '[--chamfer:14px]', inner: '[--chamfer:13.6px]' },
  lg: { outer: '[--chamfer:20px]', inner: '[--chamfer:19.6px]' },
} as const

/**
 * Panel HUD: sudut kiri-atas & kanan-bawah terpotong (chamfer), garis tepi 1px, dan (opsional) aksen
 * gradient brand di atas. Garis dibuat dua lapis — luar = warna garis, dalam = kartu — karena clip-path
 * ikut memotong border biasa. Dialog memakai gaya yang sama lewat className DialogContent.
 */
export function HudPanel<T extends ElementType = 'div'>({
  as,
  children,
  className,
  innerClassName,
  borderClassName = 'bg-border',
  accent = true,
  size = 'lg',
  ...rest
}: HudPanelProps<T>) {
  const Component = (as ?? 'div') as ElementType
  return (
    <Component
      className={cn('chamfer block p-px transition-colors duration-200 motion-reduce:transition-none', SIZE[size].outer, borderClassName, className)}
      {...rest}
    >
      <div className={cn('chamfer relative h-full bg-card', SIZE[size].inner, innerClassName)}>
        {accent && <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-brand" />}
        {children}
      </div>
    </Component>
  )
}
