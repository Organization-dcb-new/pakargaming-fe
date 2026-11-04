'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link } from '../../../i18n/routing'
import type { ShowGame } from '../../../types/Show'
import { ShowBadge, ShowBadgeVariant } from './ShowBadge'
import { getInitials } from '../../../utils/initials'

interface GameTileProps {
  game: ShowGame
  /** Ribbon animasi (kilau) sesuai flag show: popular / new / hot */
  badge?: ShowBadgeVariant | null
}

/**
 * Kartu game fluid (mengikuti kolom grid, bukan pixel mati) dengan hover lift + glow cyan,
 * glare sweep, ribbon animasi, dan fallback saat thumbnail kosong/gagal dimuat.
 */
export function GameTile({ game, badge }: GameTileProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showFallback = !game.thumbnail_url || imageFailed

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group flex h-full w-full flex-col gap-2.5 rounded-2xl border border-border bg-card p-2 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:border-primary hover:shadow-glow active:scale-[0.98] sm:p-2.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
        {showFallback ? (
          <div className="bg-stripes flex h-full w-full items-center justify-center">
            <span
              aria-hidden
              className="font-display text-2xl font-bold tracking-wide text-muted-foreground sm:text-3xl"
            >
              {getInitials(game.name)}
            </span>
          </div>
        ) : (
          <Image
            src={game.thumbnail_url}
            alt={game.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            onError={() => setImageFailed(true)}
          />
        )}

        {badge && (
          <span className="absolute left-1.5 top-1.5 z-10">
            <ShowBadge variant={badge} animated />
          </span>
        )}

        {/* Glare sweep saat hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden"
        />
      </div>

      <p className="line-clamp-2 px-0.5 text-sm font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
        {game.name}
      </p>
    </Link>
  )
}
