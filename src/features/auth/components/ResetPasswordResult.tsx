'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { StateGlyph, type StateGlyphTone } from '@/components/ui/state-glyph'

const TONE = {
  primary: 'brand',
  success: 'success',
  destructive: 'destructive',
  warning: 'warning',
} as const satisfies Record<string, StateGlyphTone>

interface ResultPanelProps {
  /** Lihat STATE_GLYPH, mis. STATE_GLYPH.success */
  glyph: string
  tone: keyof typeof TONE
  title: string
  description: string
  /** Pindahkan fokus ke judul saat panel muncul menggantikan form (mis. setelah sukses). */
  focusOnMount?: boolean
  children?: ReactNode
}

/** Kepala kartu reset password: glyph HUD + judul (h1) + deskripsi. */
export default function ResetPasswordResult({
  glyph,
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
        <StateGlyph glyph={glyph} tone={TONE[tone]} />
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
