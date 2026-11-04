import { ReactNode } from 'react'
import { Lock } from 'lucide-react'

interface StepCardProps {
  /** Id section — target scroll dari GameTransaction (account-section, product-section, dst.) */
  id: string
  step: number
  title: ReactNode
  /** Langkah sebelumnya belum selesai: konten diredupkan + ikon gembok (rules §9) */
  locked?: boolean
  lockedLabel?: string
  className?: string
  children: ReactNode
}

/** Kartu langkah checkout: badge nomor bersudut (ungu logo) + judul font display. */
export default function StepCard({
  id,
  step,
  title,
  locked = false,
  lockedLabel,
  className = '',
  children,
}: StepCardProps) {
  const headingId = `${id}-title`

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`w-full scroll-mt-24 rounded-2xl border border-border bg-card p-4 sm:p-5 ${className}`}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          aria-hidden
          className="chamfer flex h-8 w-8 shrink-0 items-center justify-center bg-brand-solid font-display text-base font-bold text-brand-solid-foreground [--chamfer:7px]"
        >
          {step}
        </span>
        <h2
          id={headingId}
          className="font-display text-lg font-semibold leading-tight text-foreground sm:text-xl"
        >
          {title}
        </h2>
        {locked && (
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only sm:not-sr-only">{lockedLabel}</span>
          </span>
        )}
      </div>

      <div
        className={`transition-opacity duration-300 motion-reduce:transition-none ${locked ? 'opacity-60' : ''}`}
      >
        {children}
      </div>
    </section>
  )
}
