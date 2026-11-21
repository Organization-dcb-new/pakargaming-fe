'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { Check, Lock, TriangleAlert } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { HudPanel } from '@/components/ui/hud-panel'

export type StepStatus = {
  /** Langkah ini sudah lengkap & valid → badge hijau bercentang */
  done: boolean
  /** Pesan validasi (muncul setelah pembeli menekan "Beli" / mengklik langkah terkunci) */
  error?: string | null
}

/** Status per id section, diisi GameTopUp — supaya komponen langkah tidak perlu meneruskan prop satu per satu. */
export const StepStatusContext = createContext<Record<string, StepStatus>>({})

interface StepCardProps {
  /** Id section — target scroll dari GameTopUp (account-section, product-section, dst.) */
  id: string
  step: number
  title: ReactNode
  /** Langkah sebelumnya belum selesai: konten diredupkan + gembok (rules §9) */
  locked?: boolean
  lockedLabel?: string
  className?: string
  children: ReactNode
}

/**
 * Kartu langkah checkout. Badge: hijau + centang = selesai, ungu + nomor = aktif, abu + gembok = terkunci.
 * Saat ada error validasi: garis merah + pesan (role="alert"); heading bisa difokus untuk scroll-ke-langkah.
 */
export default function StepCard({
  id,
  step,
  title,
  locked = false,
  lockedLabel,
  className = '',
  children,
}: StepCardProps) {
  const t = useTranslations('GameCheckout')
  const { done = false, error } = useContext(StepStatusContext)[id] ?? {}
  const headingId = `${id}-title`
  const errorId = `${id}-error`
  const isDone = done && !locked

  return (
    <HudPanel
      as="section"
      id={id}
      aria-labelledby={headingId}
      aria-describedby={error ? errorId : undefined}
      accent={false}
      size="md"
      borderClassName={error ? 'bg-destructive' : 'bg-border'}
      className={`w-full scroll-mt-24 ${className}`}
      innerClassName="p-4 sm:p-5"
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          aria-hidden
          className={`chamfer flex h-8 w-8 shrink-0 items-center justify-center font-display text-base font-bold [--chamfer:7px] ${
            locked
              ? 'bg-muted text-muted-foreground'
              : isDone
                ? 'bg-success text-success-foreground'
                : 'bg-brand-solid text-brand-solid-foreground'
          }`}
        >
          {locked ? (
            <Lock className="h-3.5 w-3.5" />
          ) : isDone ? (
            <Check className="h-4 w-4" strokeWidth={3} />
          ) : (
            step
          )}
        </span>
        <h2
          id={headingId}
          tabIndex={-1}
          className="font-display text-lg font-semibold leading-tight text-foreground outline-none sm:text-xl"
        >
          {title}
          {isDone && <span className="sr-only"> — {t('stepDone')}</span>}
        </h2>
        {locked && lockedLabel && (
          <span className="ml-auto text-xs font-medium text-muted-foreground">
            <span className="sr-only sm:not-sr-only">{lockedLabel}</span>
          </span>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      <div
        className={`transition-opacity duration-300 motion-reduce:transition-none ${locked ? 'opacity-60' : ''}`}
      >
        {children}
      </div>
    </HudPanel>
  )
}
