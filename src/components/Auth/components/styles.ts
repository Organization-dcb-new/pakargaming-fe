import { fieldInputClass } from '../../GameTransaction/components/fieldStyles'
import { focusRing } from '../../Navigation/config'
import { cn } from '../../ui/utils'

/** Gaya form auth (dialog Masuk/Daftar, halaman reset password) — mengikuti field checkout. */
export const authLabelClass = 'text-sm font-semibold text-muted-foreground'

export const authInputClass = cn(
  fieldInputClass,
  'aria-invalid:border-destructive aria-invalid:focus:ring-destructive/30 disabled:cursor-not-allowed disabled:opacity-60',
)

export const authHintClass = 'text-xs leading-relaxed text-muted-foreground'

/** Dialog & kartu pakai bg-card, jadi offset ring ikut card. */
const cardFocusRing = cn(focusRing, 'focus-visible:ring-offset-card')

export const primaryButtonClass = cn(
  'chamfer flex h-11 w-full cursor-pointer touch-manipulation items-center justify-center gap-2 rounded-sm bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors duration-200 [--chamfer:8px] hover:bg-primary/85 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none',
  cardFocusRing,
)

export const secondaryButtonClass = cn(
  'flex h-11 w-full cursor-pointer touch-manipulation items-center justify-center gap-2.5 rounded-lg border border-border bg-background/40 px-4 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/50 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none',
  cardFocusRing,
)

// text-sm eksplisit: theme.css memberi <button> font-size base secara default
export const textLinkClass = cn(
  'cursor-pointer rounded-sm text-sm font-semibold text-primary underline-offset-4 transition-colors duration-200 hover:underline disabled:cursor-not-allowed disabled:opacity-60',
  cardFocusRing,
)

export const spinnerClass = 'size-4 animate-spin motion-reduce:animate-none'
