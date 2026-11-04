'use client'

import { Show } from '../../types/Show'
import { Link } from '../../i18n/routing'
import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
import { Search } from 'lucide-react'

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
  const tHome = useTranslations('Home')
  const shouldReduceMotion = useReducedMotion()

  const chipTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 400, damping: 32 }

  return (
    <nav
      id="show-navigation"
      aria-label={tHome('sectionNavLabel')}
      className={`
          p-3
          sticky top-14 md:top-16 z-40
          py-2 md:py-3
          flex md:flex-wrap
          gap-2 md:gap-4
          justify-start md:justify-center
          overflow-x-auto md:overflow-visible
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] md:[mask-image:none]
          transition-[background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none
          ${
            isNavSticky
              ? 'bg-background/85 backdrop-blur-md border-b border-border shadow-sm'
              : 'bg-transparent border-b border-transparent'
          }
        `}
    >
      {shows.map((show) => {
        const isSelected = selectedId === `show-${show.id}`

        return (
          <button
            key={show.id}
            onClick={() => scrollToSection(`show-${show.id}`)}
            aria-current={isSelected ? 'true' : undefined}
            className={`
          relative
          flex-shrink-0
          px-3 md:px-4
          py-1.5 md:py-2
          rounded-full
          text-xs md:text-sm
          font-semibold
          transition-colors duration-200 motion-reduce:transition-none
          cursor-pointer
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          ${
            isSelected
              ? 'text-background border border-transparent'
              : 'bg-card text-muted-foreground border border-border hover:border-primary/60 hover:text-foreground'
          }
        `}
          >
            {isSelected && (
              <motion.span
                layoutId="show-chip-active"
                aria-hidden
                className="absolute inset-0 rounded-full bg-foreground shadow-md"
                transition={chipTransition}
              />
            )}
            <span className="relative z-10">{show.name}</span>
          </button>
        )
      })}

      {shows.length > 0 && (
        <Link
          href="/check-transaction"
          className="
    flex-shrink-0
    px-3 md:px-4
    py-1.5 md:py-2
    rounded-full
    text-xs md:text-sm
    font-semibold
    transition-colors duration-200 motion-reduce:transition-none
    cursor-pointer
    border border-primary/50
    bg-primary/10
    text-primary
    hover:bg-primary/20
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
    flex items-center gap-2
  "
        >
          <Search className="h-4 w-4" aria-hidden />
          {t('checkTrxLink')}
        </Link>
      )}
    </nav>
  )
}
