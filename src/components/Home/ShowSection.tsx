import { useEffect, useState } from 'react'
import { Show } from '../../types/Show'
import { useLocale } from 'next-intl'
import { getRibbon } from '../../utils/ribbon'
import Image from 'next/image'
import Link from 'next/link'

interface ShowSectionProps {
  shows: Show[]
}
export default function ShowSectionGames({ shows }: ShowSectionProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const locale = useLocale()

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile() // initial
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      {/* ===== SHOW SECTIONS ===== */}
      {shows.map((show) => {
        const limit = isMobile ? 3 : 5
        const isExpanded = expanded[show.ID] ?? false
        const hasManyGames = show.Games.length > limit

        const games = isExpanded ? show.Games : show.Games.slice(0, limit)

        const ribbon = getRibbon(show)

        return (
          <div
            key={show.ID}
            id={`show-${show.ID}`}
            className="scroll-mt-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-10 space-y-12"
          >
            {/* HEADER */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                {show.Name}
              </h2>
            </div>

            {/* GAMES GRID */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols- gap-6">
              {games.map((game) => (
                <Link
                  key={game.ID}
                  href={`/${locale}/games/${game.Slug}`}
                  className="
    group flex flex-col overflow-hidden rounded-2xl
    border border-white/10
    bg-gray-300 dark:bg-zinc-900/40
    transition-all duration-300
    hover:border-purple-500/60
    hover:shadow-lg hover:shadow-purple-500/20
  "
                >
                  {/* IMAGE CONTAINER - Switched to aspect-video for consistency */}
                  <div className="relative aspect-video w-full overflow-hidden">
                    {/* RIBBON */}
                    {ribbon && (
                      <div
                        className={`
      absolute z-20
      /* Positioning: Diagonal offset adjustments */
      top-2 left-[-34px]
      md:top-3 md:left-[-38px]
      lg:top-3.5 lg:left-[-42px]
      
      rotate-[-45deg]
      bg-gradient-to-r ${ribbon.className}
      
      /* Width: Fixed width works best for rotation stability */
      w-[115px] 
      md:w-[135px] 
      lg:w-[155px]
      
      /* Vertical Thickness */
      py-0.5 
      md:py-1
      
      /* Typography */
      text-[7px] 
      md:text-[9px] 
      lg:text-[10px]
      
      font-extrabold text-white 
      uppercase tracking-wider 
      text-center shadow-md
    `}
                      >
                        {ribbon.label}
                      </div>
                    )}

                    <Image
                      src={game.ThumbnailURL || 'https://api.dicebear.com/9.x/pixel-art/svg'}
                      alt={game.Name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      priority
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* TITLE SECTION - Improved padding and vertical alignment */}
                  <div
                    className="
    /* Layout */
    flex grow flex-col justify-center
    border-t border-gray-100 dark:border-zinc-800
    bg-gray-50 dark:bg-zinc-800/50
    
    /* Responsive Sizing */
    p-1.5 sm:p-2 md:p-3           /* Padding lebih tipis di HP */
    min-h-[36px] sm:min-h-[44px]  /* Tinggi minimum lebih pendek di HP */
    
    text-center
  "
                  >
                    <p
                      className="
      /* Responsive Text */
      text-[10px] sm:text-xs md:text-sm 
      font-semibold leading-tight
      text-gray-800 dark:text-zinc-100
      line-clamp-2
    "
                    >
                      {game.Name}
                    </p>
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
    </>
  )
}
