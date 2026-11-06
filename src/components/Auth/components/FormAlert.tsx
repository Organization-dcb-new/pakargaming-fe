import { CircleAlert, CircleCheck, Info, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../ui/utils'

type Tone = 'error' | 'info' | 'success'

const TONE: Record<Tone, { Icon: LucideIcon; box: string; icon: string }> = {
  error: { Icon: CircleAlert, box: 'border-destructive/40 bg-destructive/10', icon: 'text-destructive' },
  info: { Icon: Info, box: 'border-info/40 bg-info/10', icon: 'text-info' },
  success: { Icon: CircleCheck, box: 'border-success/40 bg-success/10', icon: 'text-success' },
}

interface FormAlertProps {
  tone: Tone
  children: ReactNode
  /** Aksi lanjutan, mis. "Masuk dengan Google" / "Lupa password". */
  actions?: ReactNode
  className?: string
}

/** Pesan level form (error server / info). Status lewat ikon + teks, bukan warna saja (rules §7). */
export default function FormAlert({ tone, children, actions, className }: FormAlertProps) {
  const { Icon, box, icon } = TONE[tone]

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex gap-3 rounded-lg border px-3.5 py-3 text-sm leading-relaxed text-foreground',
        box,
        className,
      )}
    >
      <Icon className={cn('mt-0.5 size-4 shrink-0', icon)} aria-hidden="true" />
      <div className="min-w-0 flex-1 space-y-2">
        <p>{children}</p>
        {actions && <div className="flex flex-wrap gap-x-4 gap-y-1.5">{actions}</div>}
      </div>
    </div>
  )
}
