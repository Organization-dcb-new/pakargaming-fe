'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronRight, Gauge, Headset, ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '../../../i18n/routing'
import { GameDetail } from '../../../types/Game'
import { getInitials } from '../../../utils/initials'

interface GameHeaderProps {
  game: GameDetail
}

/** Header ringkas halaman top-up: breadcrumb + ikon game + nama + chip keunggulan. */
export default function GameHeader({ game }: GameHeaderProps) {
  const t = useTranslations('GameCheckout')
  const tNav = useTranslations('Navigation')
  const [imageFailed, setImageFailed] = useState(false)
  const showFallback = !game.thumbnail_url || imageFailed

  const features = [
    { icon: Gauge, label: t('bannerFeature1'), tone: 'border-primary/30 bg-primary/10', iconTone: 'text-primary' },
    { icon: Headset, label: t('bannerFeature2'), tone: 'border-brand/40 bg-brand/10', iconTone: 'text-brand' },
    { icon: ShieldCheck, label: t('bannerFeature3'), tone: 'border-success/30 bg-success/10', iconTone: 'text-success' },
  ]

  return (
    <header className="mb-6">
      <nav aria-label={t('breadcrumbLabel')} className="mb-4">
        <ol className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
          <li className="shrink-0">
            <Link
              href="/"
              className="rounded-sm transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {tNav('home')}
            </Link>
          </li>
          <li aria-hidden className="shrink-0">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li aria-current="page" className="truncate font-medium text-foreground">
            {game.name}
          </li>
        </ol>
      </nav>

      <div className="flex items-center gap-4 sm:gap-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted sm:h-24 sm:w-24">
          {showFallback ? (
            <div
              aria-hidden
              className="bg-stripes flex h-full w-full items-center justify-center font-display text-xl font-bold text-muted-foreground sm:text-2xl"
            >
              {getInitials(game.name)}
            </div>
          ) : (
            <Image
              src={game.thumbnail_url}
              alt={game.name}
              fill
              unoptimized
              priority
              sizes="96px"
              className="object-cover"
              onError={() => setImageFailed(true)}
            />
          )}
        </div>

        <div className="min-w-0 space-y-2.5">
          <h1 className="text-balance font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {game.name}
          </h1>
          <ul className="flex flex-wrap gap-2">
            {features.map(({ icon: Icon, label, tone, iconTone }) => (
              <li
                key={label}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold text-foreground ${tone}`}
              >
                <Icon className={`h-3.5 w-3.5 shrink-0 ${iconTone}`} aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
