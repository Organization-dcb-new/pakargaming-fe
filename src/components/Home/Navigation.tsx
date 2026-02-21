import { Show } from '../../types/Show'
import Link from 'next/link'

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

      {shows.length > 0 && (
        <Link
          href="/en/check-transaction"
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

    bg-emerald-500
    text-white
    border border-emerald-500
    hover:bg-emerald-600
    hover:scale-[1.05]
    dark:bg-emerald-400
    dark:border-emerald-400
    dark:hover:bg-emerald-500

    flex items-center gap-2
  `}
        >
          <span className="text-base">🔍</span>
          Cek Transaksi
        </Link>
      )}
    </div>
  )
}
