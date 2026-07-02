'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Show } from '../../types/Show'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { Reveal } from './components/Reveal'
import { GameTile } from './components/GameTile'
import { SectionHeader } from './components/SectionHeader'
import { getShowBadgeVariant } from './components/ShowBadge'

interface ShowSectionProps {
  shows: Show[]
}

export default function ShowSectionGames({ shows }: ShowSectionProps) {
  const t = useTranslations('Home')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const breakpoint = useBreakpoint()
  const LIMIT_MAP = {
    mobile: 3,
    tablet: 5,
    desktop: 6,
  } as const
  const limit = LIMIT_MAP[breakpoint] ?? 6

  return (
    <>
      {shows.map((show) => {
        const isExpanded = expanded[show.id] ?? false
        const hasManyGames = show.games.length > limit

        const games = isExpanded ? show.games : show.games.slice(0, limit)
        const badge = getShowBadgeVariant(show)

        return (
          <section
            key={show.id}
            id={`show-${show.id}`}
            className="scroll-mt-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-5"
          >
            <Reveal>
              {/* Badge pindah ke ribbon animasi di tile — header cukup judul + jumlah */}
              <SectionHeader title={show.name} count={show.games.length} />
            </Reveal>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">
              {games.map((game, i) => (
                <Reveal key={game.id} delay={(i % 6) * 0.04}>
                  <GameTile game={game} badge={badge} />
                </Reveal>
              ))}
            </div>

            {hasManyGames && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [show.id]: !isExpanded,
                    }))
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-card px-5 py-2 text-sm font-semibold text-brand shadow-sm transition-all duration-200 hover:border-brand hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  {isExpanded
                    ? t('showLessGames')
                    : t('showMoreCount', { count: show.games.length - limit })}
                  <ChevronDown
                    aria-hidden
                    className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            )}
          </section>
        )
      })}
    </>
  )
}
