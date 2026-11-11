'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import type { ShowGame } from '@/features/home/types/show'
import { ShowBadge, ShowBadgeVariant } from './ShowBadge'
import { getInitials } from '@/lib/initials'
import { canOptimize } from '@/lib/image'

interface GameTileProps {
  game: ShowGame
  /** Ribbon animasi (kilau) sesuai flag show: popular / new / hot */
  badge?: ShowBadgeVariant | null
  /** true untuk tile yang kelihatan tanpa scroll (above the fold) — jangan di-lazy-load biar LCP cepat */
  eager?: boolean
}

/**
 * Kartu game chamfer (sudut kiri-atas & kanan-bawah terpotong, seperti logo & CTA): gambar full-bleed,
 * nama font display di bawah. Border 1px dibuat dua lapis (luar = warna garis, dalam = kartu) karena
 * clip-path ikut memotong border biasa; glow hover memakai drop-shadow karena box-shadow ikut terpotong.
 */
export function GameTile({ game, badge, eager = false }: GameTileProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showFallback = !game.thumbnail_url || imageFailed

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group block h-full w-full transition-[transform,filter] duration-200 ease-out hover:-translate-y-1 hover:[filter:drop-shadow(0_10px_16px_color-mix(in_oklab,var(--primary)_40%,transparent))] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Lapis garis: berubah cyan saat hover/fokus */}
      <div className="chamfer h-full bg-border p-px transition-colors duration-200 [--chamfer:14px] group-hover:bg-primary group-focus-visible:bg-primary motion-reduce:transition-none">
        <div className="chamfer flex h-full flex-col bg-card [--chamfer:13.6px]">
          <div className="relative aspect-square w-full overflow-hidden bg-muted">
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
                unoptimized={!canOptimize(game.thumbnail_url)}
                loading={eager ? 'eager' : 'lazy'}
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                onError={() => setImageFailed(true)}
              />
            )}

            {badge && (
              <span className="absolute left-2.5 top-2 z-10">
                <ShowBadge variant={badge} animated />
              </span>
            )}

            {/* Glare sweep saat hover */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden"
            />
          </div>

          <p className="line-clamp-2 border-t border-border px-2.5 py-2 font-display text-sm font-bold uppercase leading-snug tracking-wide text-foreground transition-colors duration-200 group-hover:text-primary sm:px-3 sm:py-2.5">
            {game.name}
          </p>
        </div>
      </div>
    </Link>
  )
}
