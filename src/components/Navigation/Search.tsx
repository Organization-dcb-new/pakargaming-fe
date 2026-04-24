'use client'

import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { useGetGameBySearch } from '../../hooks/useGame'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { Link } from '../../i18n/routing'
import { useTranslations } from 'next-intl'

export type SearchNavVariant = 'mobile' | 'desktop'

type SearchComponentProps = {
  variant?: SearchNavVariant
  /** Hanya dipakai variant mobile: saat true & layar phone, logo nav bisa ikut collapse */
  onOpenChange?: (open: boolean) => void
}

export default function SearchComponent({
  variant = 'desktop',
  onOpenChange,
}: SearchComponentProps) {
  const t = useTranslations('Navigation')
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword] = useDebounce(keyword, 400)
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isMobileNav = variant === 'mobile'
  const isDesktopNav = variant === 'desktop'
  const isPhone = useMediaQuery('(max-width: 639px)')

  /** Phone: ikon bisa minimize. Tablet+ dalam mobile nav & desktop: bar penuh selalu */
  const collapsibleChrome = isMobileNav && isPhone
  const effectiveOpen = isDesktopNav ? true : isMobileNav ? !isPhone || open : open

  useEffect(() => {
    if (!isMobileNav || !onOpenChange) return
    onOpenChange(collapsibleChrome ? open : false)
  }, [open, collapsibleChrome, isMobileNav, onOpenChange])

  const { data, isLoading } = useGetGameBySearch(debouncedKeyword)
  const games = data?.data ?? []

  return (
    <div
      className={[
        'relative min-w-0',
        isDesktopNav ? 'w-full min-w-0 max-w-full flex-1' : 'w-full min-w-0 max-w-full',
      ].join(' ')}
    >
      {/* INPUT */}
      <div
        onClick={() => {
          if (!effectiveOpen && collapsibleChrome) {
            setOpen(true)
            queueMicrotask(() => inputRef.current?.focus())
          }
        }}
        className={[
          'flex h-10 w-full items-center border border-purple-500/30 bg-white px-2.5 shadow-sm dark:bg-black/30 min-[400px]:px-3',
          effectiveOpen ? 'rounded-xl sm:rounded-full' : 'cursor-pointer rounded-full',
        ].join(' ')}
      >
        <button
          type="button"
          className="inline-flex shrink-0 cursor-pointer touch-manipulation rounded-md text-purple-600 outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 dark:text-purple-400"
          aria-expanded={effectiveOpen}
          aria-label={effectiveOpen ? t('collapseSearch') : t('searchPlaceholder')}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation()
            if (collapsibleChrome) {
              if (open) {
                setOpen(false)
                inputRef.current?.blur()
              } else {
                setOpen(true)
                queueMicrotask(() => inputRef.current?.focus())
              }
            } else {
              queueMicrotask(() => inputRef.current?.focus())
            }
          }}
        >
          <Search size={18} />
        </button>
        <input
          ref={inputRef}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => {
            if (collapsibleChrome || isMobileNav) setOpen(true)
          }}
          onClick={(e) => e.stopPropagation()}
          onBlur={() => {
            if (collapsibleChrome && !keyword) setOpen(false)
          }}
          placeholder={t('searchPlaceholder')}
          className={[
            'ml-2 min-w-0 flex-1 cursor-text bg-transparent text-sm outline-none transition-opacity duration-200',
            effectiveOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
          ].join(' ')}
        />
      </div>

      {/* PREVIEW */}
      {effectiveOpen && debouncedKeyword && (
        <div className="absolute left-0 right-0 top-11 z-[60] max-h-[min(22rem,70vh)] overflow-y-auto overflow-x-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 sm:top-12">
          {isLoading && (
            <div className="flex items-center gap-3 p-4 text-sm text-gray-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"></div>
              <span>{t('searching')}</span>
            </div>
          )}

          {!isLoading && games.length === 0 && (
            <div className="p-8 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('gameNotFound')}</p>
            </div>
          )}

          {!isLoading && games.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              {games.slice(0, 5).map((game) => (
                <Link
                  onClick={() => setKeyword('')}
                  key={game.id}
                  href={`/games/${game.slug}`}
                  className="group flex items-center gap-3 border-b border-gray-100 px-4 py-3 transition-all duration-200 last:border-b-0 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:border-gray-800 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20"
                >
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 ring-2 ring-gray-200 transition-all group-hover:ring-purple-400 dark:bg-gray-800 dark:ring-gray-700 dark:group-hover:ring-purple-500">
                    {game.thumbnail_url ? (
                      <img
                        src={game.thumbnail_url}
                        alt={game.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 transition-colors group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
                      {game.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
