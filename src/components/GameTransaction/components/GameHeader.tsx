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

/** Header halaman top-up: breadcrumb + strip banner art + ikon game (menindih) + nama + chip keunggulan. */
export default function GameHeader({ game }: GameHeaderProps) {
  const t = useTranslations('GameCheckout')
  const tNav = useTranslations('Navigation')
  const [imageFailed, setImageFailed] = useState(false)
  const [bannerFailed, setBannerFailed] = useState(false)
  const showFallback = !game.thumbnail_url || imageFailed
  // Strip banner selalu tampil; tanpa art (kosong / gagal dimuat) → latar dekoratif bertema logo
  const showBannerArt = !!game.banner_url && !bannerFailed

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

      <div className="relative isolate h-36 overflow-hidden rounded-2xl border border-border bg-card sm:h-48 lg:h-56">
        {showBannerArt ? (
          <>
            <Image
              src={game.banner_url}
              alt=""
              fill
              unoptimized
              priority
              sizes="(max-width: 1280px) 100vw, 1216px"
              className="object-cover"
              onError={() => setBannerFailed(true)}
            />
            {/* Scrim bawah (di atas media) supaya tepi ikon yang menindih tetap tegas */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"
            />
          </>
        ) : (
          <div aria-hidden className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-brand opacity-20" />
            <div className="bg-stripes absolute inset-0" />
            <Image
              src="/logo.png"
              alt=""
              width={224}
              height={224}
              className="absolute -bottom-10 right-4 h-44 w-44 object-contain opacity-15 sm:h-56 sm:w-56 lg:right-12"
            />
          </div>
        )}
      </div>

      <div className="flex items-start gap-4 px-3 sm:gap-5 sm:px-5">
        <div
          className="relative -mt-10 h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted shadow-lg ring-4 ring-background sm:-mt-12 sm:h-24 sm:w-24"
        >
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

        <div className="min-w-0 space-y-2.5 pt-3">
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
