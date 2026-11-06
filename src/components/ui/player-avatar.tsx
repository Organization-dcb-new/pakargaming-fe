import { cn } from './utils'

type Size = 'sm' | 'md' | 'lg'

// Bingkai chamfer bergradient brand (dekoratif) + foto/inisial di dalamnya. Chamfer dalam sedikit lebih kecil.
const FRAME: Record<Size, string> = {
  sm: 'p-px [--chamfer:6px]',
  md: 'p-0.5 [--chamfer:8px]',
  lg: 'p-[3px] [--chamfer:16px]',
}
const IMAGE: Record<Size, string> = {
  sm: 'size-8 [--chamfer:5.5px]',
  md: 'size-10 [--chamfer:7px]',
  lg: 'size-16 sm:size-24 [--chamfer:14.5px]',
}

/** Avatar "pemain" (navbar, dropdown akun, dasbor). Dekoratif: nama user selalu tampil di sebelahnya. */
export function PlayerAvatar({ src, size = 'md', className }: { src: string; size?: Size; className?: string }) {
  return (
    <span className={cn('chamfer inline-flex shrink-0 bg-gradient-brand', FRAME[size], className)}>
      <img src={src} alt="" aria-hidden="true" className={cn('chamfer bg-card object-cover', IMAGE[size])} />
    </span>
  )
}
