'use client'

import { Show } from '../../types/Show'
import { Link } from '../../i18n/routing'
import { useTranslations } from 'next-intl'

interface NavigationShowProps {
  isNavSticky: boolean
  scrollToSection: (id: string) => void
  selectedId: string
  shows: Show[]
}

export default function NavigationShowGame({
  isNavSticky,
  scrollToSection,
  selectedId,
  shows,
}: NavigationShowProps) {
  const t = useTranslations('CheckTransaction')

  return (
    <div
      id="show-navigation"
      className={`
          p-3
          sticky top-14 md:top-16 z-30
          py-2 md:py-3
          flex md:flex-wrap
          gap-2 md:gap-4
          justify-start md:justify-center
          overflow-x-auto md:overflow-visible
          scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100
          transition-all duration-300
          bg-transparent
        `}
    >
      {shows.map((show) => {
        const isSelected = selectedId === `show-${show.id}`

        return (
          <button
            key={show.id}
            onClick={() => scrollToSection(`show-${show.id}`)}
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
                bg-gradient-to-r from-brand to-brand-2
                text-brand-foreground
                border border-brand/60
                ring-2 ring-brand/40
                shadow-brand/40
              `
              : `
                bg-card
                text-brand
                border border-brand/30
                hover:border-brand
                hover:shadow-md
              `
          }
          ${!isSelected && 'hover:scale-[1.05]'}
        `}
          >
            {show.name}
          </button>
        )
      })}

      {shows.length > 0 && (
        <Link
          href="/check-transaction"
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

    bg-gradient-to-r from-brand to-brand-2
    text-brand-foreground
    hover:brightness-110
    hover:scale-[1.05]

    flex items-center gap-2
  `}
        >
          <span className="text-base">🔍</span>
          {t('checkTrxLink')}
        </Link>
      )}
    </div>
  )
}
