import { cn } from '@/lib/cn'

/**
 * Glyph standar untuk empty/error/result state — pengganti "ikon stok dalam kotak berwarna".
 * Semua karakter ada di subset latin font display (Chakra Petch); jangan pakai ✓/✕ dsb.
 * karena akan jatuh ke font sistem dan terlihat beda.
 */
export const STATE_GLYPH = {
  error: '!',
  empty: '0',
  notFound: '?',
  email: '@',
  success: 'OK',
  maintenance: '||',
  password: '•••',
  /** Link/kode kadaluarsa — seperti timer yang habis */
  expired: '00:00',
} as const

export type StateGlyphTone = 'brand' | 'destructive' | 'success' | 'warning' | 'muted'

const TONE: Record<StateGlyphTone, string> = {
  brand: 'text-gradient-brand',
  destructive: 'text-destructive',
  success: 'text-success',
  warning: 'text-warning',
  muted: 'text-muted-foreground',
}

const SIZE = {
  md: 'text-4xl',
  lg: 'text-5xl',
  xl: 'text-6xl',
} as const

interface StateGlyphProps {
  glyph: string
  tone?: StateGlyphTone
  size?: keyof typeof SIZE
  className?: string
}

/** Satu karakter besar ber-font display (gaya HUD). Dekoratif — makna ada di judul/teks di sebelahnya. */
export function StateGlyph({ glyph, tone = 'brand', size = 'lg', className }: StateGlyphProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block select-none font-display font-bold leading-none tracking-tight tabular-nums',
        TONE[tone],
        SIZE[size],
        className,
      )}
    >
      {glyph}
    </span>
  )
}
