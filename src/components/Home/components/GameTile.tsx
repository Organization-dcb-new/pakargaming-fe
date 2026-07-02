'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Gamepad2 } from 'lucide-react'
import { Link } from '../../../i18n/routing'
import type { ShowGame } from '../../../types/Show'
import { ShowBadge, ShowBadgeVariant } from './ShowBadge'

interface GameTileProps {
  game: ShowGame
  /** Ribbon animasi (kilau) sesuai flag show: popular / new / hot */
  badge?: ShowBadgeVariant | null
}

/**
 * Tile game fluid (mengikuti kolom grid, bukan pixel mati) dengan hover lift,
 * glare sweep, ribbon animasi, dan fallback saat thumbnail kosong/gagal dimuat.
 */
export function GameTile({ game, badge }: GameTileProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showFallback = !game.thumbnail_url || imageFailed

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group flex w-full flex-col gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/60 bg-muted shadow-sm transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:border-brand/60 group-hover:shadow-lg group-hover:shadow-brand/15 group-active:scale-[0.98] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-active:scale-100">
        {showFallback ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-accent">
            <Gamepad2 className="h-8 w-8 text-muted-foreground" aria-hidden />
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

      <p className="line-clamp-2 text-center text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-brand">
        {game.name}
      </p>
    </Link>
  )
}
