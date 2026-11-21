'use client'

import { Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import type { AuthMe } from '@/features/auth/api/auth'
import { HudPanel } from '@/components/ui/hud-panel'
import { focusRing } from '@/styles/focusRing'
import { cn } from '@/lib/cn'
import DeleteAccountDialog from './DeleteAccountDialog'

/**
 * Kartu "Hapus akun" di Dasbor — hak hapus data yang dijanjikan Kebijakan Privasi. Data akun dihapus;
 * riwayat transaksi tetap disimpan sebagai catatan keuangan.
 */
export default function DeleteAccountSection({ me }: { me: AuthMe | undefined }) {
  const t = useTranslations('DeleteAccount')
  const [open, setOpen] = useState(false)

  return (
    <HudPanel as="section" aria-labelledby="delete-account-title" accent={false} innerClassName="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1 space-y-1">
          <h2
            id="delete-account-title"
            className="flex items-center gap-2.5 font-display text-lg font-bold text-foreground before:h-5 before:w-1.5 before:shrink-0 before:-skew-x-12 before:bg-destructive"
          >
            {t('title')}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{t('description')}</p>
        </div>
        <button
          type="button"
          aria-haspopup="dialog"
          disabled={!me}
          onClick={() => setOpen(true)}
          className={cn(
            'inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm border border-destructive/50 px-4 text-sm font-semibold text-destructive transition-colors duration-200 hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none',
            focusRing,
          )}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          {t('button')}
        </button>
      </div>
      {me && <DeleteAccountDialog me={me} open={open} onOpenChange={setOpen} />}
    </HudPanel>
  )
}
