'use client'

import { ChevronDown, Globe } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRegion } from '@/hooks/useRegion'
import { regionName } from '@/lib/regionName'
import { cn } from '@/lib/cn'
import { focusRing } from '@/styles/focusRing'

interface RegionSwitcherProps {
  /** `desktop`: dropdown di topbar. `mobile`: daftar pilihan di dalam sheet menu (tanpa dropdown bertumpuk). */
  variant: 'desktop' | 'mobile'
  /** Gaya judul bagian di sheet mobile, supaya sama dengan judul bagian lain di menu. */
  labelClassName?: string
}

const codeBadgeClass = 'font-display text-xs font-bold uppercase tracking-wider'

/**
 * Pemilih region akun game. Etalase, pencarian, katalog, dan halaman game mengikuti pilihan ini.
 * Tidak dirender selama hanya satu region yang punya game tampil.
 */
export default function RegionSwitcher({ variant, labelClassName }: RegionSwitcherProps) {
  const t = useTranslations('Navigation')
  const locale = useLocale()
  const { region, regions, setRegion } = useRegion()

  if (regions.length <= 1) return null

  const options = regions.map((r) => ({ code: r.code, name: regionName(r.code, locale, r.name) }))

  if (variant === 'mobile') {
    return (
      <div className="space-y-2">
        <p id="mobile-region-label" className={labelClassName}>
          {t('region')}
        </p>
        <div role="group" aria-labelledby="mobile-region-label" className="grid grid-cols-2 gap-2">
          {options.map(({ code, name }) => {
            const active = code === region
            return (
              <button
                key={code}
                type="button"
                onClick={() => setRegion(code)}
                aria-pressed={active}
                className={cn(
                  'flex h-10 min-w-0 cursor-pointer touch-manipulation items-center gap-2 rounded-lg border px-3 text-left text-sm font-medium transition-colors duration-200',
                  active
                    ? 'border-primary/60 bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
                  focusRing,
                )}
              >
                <span className={codeBadgeClass}>{code}</span>
                <span className="truncate">{name}</span>
              </button>
            )
          })}
        </div>
        <p className="px-3 text-xs text-muted-foreground">{t('regionHint')}</p>
      </div>
    )
  }

  const current = options.find((o) => o.code === region)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t('regionCurrent', { name: current?.name ?? region.toUpperCase() })}
          className={cn(
            'group inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-foreground transition-colors duration-200 hover:bg-muted data-[state=open]:bg-muted',
            focusRing,
          )}
        >
          <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className={codeBadgeClass}>{region}</span>
          <ChevronDown
            className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-60 rounded-xl p-1.5">
        <DropdownMenuLabel className="px-2 pb-1.5 pt-1 font-normal">
          <p className="text-sm font-semibold text-foreground">{t('regionMenu')}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{t('regionHint')}</p>
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={region} onValueChange={setRegion}>
          {options.map(({ code, name }) => (
            <DropdownMenuRadioItem
              key={code}
              value={code}
              className="cursor-pointer rounded-lg py-2 focus:bg-primary/10 focus:text-primary"
            >
              <span className="min-w-0 flex-1 truncate">{name}</span>
              <span className={cn(codeBadgeClass, 'text-muted-foreground')}>{code}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
