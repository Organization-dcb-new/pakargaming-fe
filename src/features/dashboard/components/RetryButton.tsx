import { RotateCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { focusRing } from '@/styles/focusRing'

interface RetryButtonProps {
  onClick: () => void
  /** Sedang refetch → tombol nonaktif + ikon berputar (cegah klik ganda). */
  isFetching: boolean
  children: ReactNode
}

/** Tombol "Coba lagi" di state error kartu dasbor (rules §6). */
export default function RetryButton({ onClick, isFetching, children }: RetryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isFetching}
      className={cn(
        'inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none',
        focusRing,
      )}
    >
      <RotateCw className={cn('size-4', isFetching && 'animate-spin motion-reduce:animate-none')} aria-hidden="true" />
      {children}
    </button>
  )
}
