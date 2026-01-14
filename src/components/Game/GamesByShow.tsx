import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useGetShows } from '../../hooks/useShow'
import { Show } from '../../types/Show'
import { useState } from 'react'

export default function GamesByShow() {
  const locale = useLocale()
  const { data, isLoading } = useGetShows()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  if (isLoading) return <GamesByShowSkeleton />

  const shows = (data?.data ?? []).filter((show) => show.IsShow)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {shows.map((show) => {
        const isExpanded = expanded[show.ID] ?? false
        const hasManyGames = show.Games.length > 6
        const games = isExpanded ? show.Games : show.Games.slice(0, 6)
        const ribbon = getRibbon(show)

        return (
          <div key={show.ID}>
            {/* HEADER */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                {show.Name}
              </h2>
            </div>

            {/* GAMES (VERTICAL GRID ONLY) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {games.map((game) => (
                <Link
                  key={game.ID}
                  href={`/${locale}/games/${game.Slug}`}
                  className="group relative rounded-2xl overflow-hidden
                    bg-black border border-white/10
                    hover:border-purple-500/60
                    hover:shadow-lg hover:shadow-purple-500/20
                    transition-all duration-300"
                >
                  {/* RIBBON */}
                  {ribbon && (
                    <div
                      className={`absolute top-3 left-[-42px] rotate-[-45deg]
                      bg-gradient-to-r ${ribbon.className}
                      text-white text-[10px] font-bold px-14 py-1 shadow-lg z-20`}
                    >
                      {ribbon.label}
                    </div>
                  )}

                  {/* IMAGE */}
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={game.ThumbnailURL}
                      alt={game.Name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  </div>

                  {/* TITLE */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-medium text-white line-clamp-2">{game.Name}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* TOMBOL TAMPILKAN LEBIH BANYAK */}
            {hasManyGames && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [show.ID]: !isExpanded,
                    }))
                  }
                  className="text-sm cursor-pointer font-medium text-purple-600 dark:text-purple-400 hover:underline"
                >
                  {isExpanded ? 'Tampilkan lebih sedikit' : 'Tampilkan lebih banyak'}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}

/* ===== RIBBON PRIORITY ===== */
function getRibbon(show: Show) {
  if (show.IsPopular) {
    return {
      label: 'POPULAR',
      className: 'from-pink-500 to-purple-600',
    }
  }

  if (show.IsNew) {
    return {
      label: 'NEW',
      className: 'from-emerald-500 to-green-600',
    }
  }

  if (show.IsHot) {
    return {
      label: 'HOT',
      className: 'from-orange-500 to-red-600',
    }
  }

  return null
}

function GamesByShowSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20 animate-pulse">
      {/* LOOP SKELETON SHOW (misal 2 section) */}
      {[...Array(1)].map((_, i) => (
        <div key={i}>
          {/* HEADER */}
          <div className="mb-8">
            <div className="h-7 w-48 rounded-md bg-gray-200 dark:bg-white/10" />
          </div>

          {/* GAMES */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, j) => (
              <div
                key={j}
                className="relative rounded-2xl overflow-hidden
                bg-gray-200 dark:bg-white/10
                h-44"
              >
                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
