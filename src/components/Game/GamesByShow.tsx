'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useGetShows } from '../../hooks/useShow'
import { Show } from '../../types/Show'
import { useEffect, useState } from 'react'

export default function GamesByShow() {
  const locale = useLocale()
  const { data, isLoading } = useGetShows()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isNavSticky, setIsNavSticky] = useState(false)

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setSelectedId(id)
    }
  }
  const shows = (data?.data ?? []).filter((show) => show.IsShow)

  useEffect(() => {
    const handleScroll = () => {
      // Check if navigation is stuck (scrolled past navbar)
      const navElement = document.getElementById('show-navigation')
      if (navElement) {
        const navTop = navElement.getBoundingClientRect().top
        // Assuming navbar height is 56px (top-14) or 64px (top-16)
        setIsNavSticky(navTop <= 64)
      }

      // Update selected show based on scroll position
      let currentId: string | null = null
      shows.forEach((show) => {
        const el = document.getElementById(`show-${show.ID}`)
        if (el) {
          const top = el.getBoundingClientRect().top
          if (top <= 120) {
            currentId = show.ID
          }
        }
      })
      if (currentId) setSelectedId(currentId)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [shows])

  if (isLoading) return <GamesByShowSkeleton />

  return (
    <section className="w-full ">
      {/* ===== SHOW NAVIGATION ===== */}
      <div
        id="show-navigation"
        className={`
          sticky top-14 md:top-16 z-30
          py-2 md:py-3
          mb-8 md:mb-12
          flex md:flex-wrap
          gap-2 md:gap-4
          justify-start md:justify-center
          overflow-x-auto md:overflow-visible
          scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100
          transition-all duration-300
          ${
            isNavSticky
              ? 'bg-white  dark:bg-black/20 border-b border-purple-500/20 backdrop-blur-sm'
              : 'bg-transparent'
          }
        `}
      >
        {shows.map((show) => {
          const isSelected = selectedId === `show-${show.ID}`

          return (
            <button
              key={show.ID}
              onClick={() => scrollToSection(`show-${show.ID}`)}
              className={`
          flex-shrink-0
          px-3 md:px-4
          py-1.5 md:py-2
          rounded-full
          text-xs md:text-sm
          font-semibold
          transition-all duration-200
          cursor-pointer
          shadow-sm
          ${
            isSelected
              ? `
                bg-purple-700
                text-white
                border border-purple-700
                ring-2 ring-purple-400
                shadow-purple-500/40
                dark:bg-purple-500 dark:border-purple-500 dark:ring-purple-400
              `
              : `
                bg-purple-200
                text-purple-900
                hover:bg-purple-300
                hover:text-purple-950
                dark:bg-purple-600
                dark:text-white
                dark:hover:bg-purple-700
              `
          }
          ${!isSelected && 'hover:scale-[1.05]'}
        `}
            >
              {show.Name}
            </button>
          )
        })}
      </div>

      {/* ===== SHOW SECTIONS ===== */}
      {shows.map((show) => {
        const isExpanded = expanded[show.ID] ?? false
        const hasManyGames = show.Games.length > 6
        const games = isExpanded ? show.Games : show.Games.slice(0, 6)
        const ribbon = getRibbon(show)

        return (
          <div
            key={show.ID}
            id={`show-${show.ID}`}
            className="scroll-mt-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12"
          >
            {/* HEADER */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                {show.Name}
              </h2>
            </div>

            {/* GAMES GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {games.map((game) => (
                <Link
                  key={game.ID}
                  href={`/${locale}/games/${game.Slug}`}
                  className="group relative rounded-2xl overflow-hidden
                    dark:bg-black border border-white/10
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
                      src={game.ThumbnailURL || 'https://api.dicebear.com/9.x/pixel-art/svg'}
                      alt={game.Name}
                      fill
                      priority
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
