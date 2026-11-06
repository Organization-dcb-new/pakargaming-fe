'use client'

import type { LucideIcon } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '../../ui/utils'

const TONE = {
  primary: 'bg-primary/15 text-primary',
  success: 'bg-success/15 text-success',
  destructive: 'bg-destructive/15 text-destructive',
} as const

interface ResultPanelProps {
  icon: LucideIcon
  tone: keyof typeof TONE
  title: string
  description: string
  /** Pindahkan fokus ke judul saat panel muncul menggantikan form (mis. setelah sukses). */
  focusOnMount?: boolean
  children?: ReactNode
}

/** Kepala kartu reset password: ikon chamfer bertint + judul (h1) + deskripsi. */
export default function ResultPanel({
  icon: Icon,
  tone,
  title,
  description,
  focusOnMount,
  children,
}: ResultPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (focusOnMount) headingRef.current?.focus()
  }, [focusOnMount])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <span
          aria-hidden="true"
          className={cn('chamfer flex size-14 items-center justify-center [--chamfer:10px]', TONE[tone])}
        >
          <Icon className="size-7" />
        </span>
        <div className="space-y-2">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-2xl font-bold tracking-tight text-foreground outline-none"
          >
            {title}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
