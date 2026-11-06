'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { cn } from './utils'

interface CopyButtonProps {
  value: string
  /** Pesan toast setelah berhasil menyalin (sudah di-i18n oleh pemanggil) */
  successMessage: string
  /** Nama aksi untuk screen reader, mis. "Salin nomor invoice" (rules §7) */
  label: string
  className?: string
  /** Konten yang tampil di samping ikon (mis. nilai yang disalin). Kosong = tombol ikon saja. */
  children?: ReactNode
}

/** Salin ke clipboard + toast + ikon centang sementara (rules §5). */
export function CopyButton({ value, successMessage, label, className, children }: CopyButtonProps) {
  const t = useTranslations('Common')
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => () => clearTimeout(timer.current), [])

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      toast.error(t('error'))
      return
    }
    setCopied(true)
    toast.success(successMessage)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1500)
  }, [value, successMessage, t])

  const Icon = copied ? Check : Copy

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={children ? undefined : label}
      title={label}
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
        className,
      )}
    >
      {children}
      {children ? <span className="sr-only">{label}</span> : null}
      <Icon
        aria-hidden
        className={cn('h-4 w-4 shrink-0', copied ? 'text-success' : 'text-muted-foreground')}
      />
    </button>
  )
}
