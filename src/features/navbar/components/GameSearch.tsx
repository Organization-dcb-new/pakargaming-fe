'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Loader2, Search } from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { useGetGameBySearch } from '@/api/games'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { canOptimize } from '@/lib/image'
import { getInitials } from '@/lib/initials'
import { STATE_GLYPH, StateGlyph } from '@/components/ui/state-glyph'

export type SearchNavVariant = 'mobile' | 'desktop'

type SearchComponentProps = {
  variant?: SearchNavVariant
  /** Hanya dipakai variant mobile: saat true & layar phone, logo nav bisa ikut collapse */
  onOpenChange?: (open: boolean) => void
}

export default function GameSearch({
  variant = 'desktop',
  onOpenChange,
}: SearchComponentProps) {
  const t = useTranslations('Navigation')
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword] = useDebounce(keyword, 400)
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  const isMobileNav = variant === 'mobile'
  const isDesktopNav = variant === 'desktop'
  const isPhone = useMediaQuery('(max-width: 639px)')

  // ⌘K / Ctrl+K memfokuskan search desktop. Label petunjuk baru diisi setelah mount (platform
  // hanya diketahui di browser) supaya tidak ada hydration mismatch.
  const [shortcutLabel, setShortcutLabel] = useState<string | null>(null)
  useEffect(() => {
    if (!isDesktopNav) return
    setShortcutLabel(/Mac|iPhone|iPad/i.test(navigator.userAgent) ? '⌘K' : 'Ctrl K')
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isDesktopNav])

  /** Phone: ikon bisa minimize. Tablet+ dalam mobile nav & desktop: bar penuh selalu */
  const collapsibleChrome = isMobileNav && isPhone
  const effectiveOpen = isDesktopNav ? true : isMobileNav ? !isPhone || open : open

  useEffect(() => {
    if (!isMobileNav || !onOpenChange) return
    onOpenChange(collapsibleChrome ? open : false)
  }, [open, collapsibleChrome, isMobileNav, onOpenChange])

  // Click outside to close mobile search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (!keyword) {
          setOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [keyword])

  const { data, isLoading } = useGetGameBySearch(debouncedKeyword)
  const games = data?.data ?? []

  return (
    <div
      ref={containerRef}
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
          'group flex h-10 w-full -skew-x-12 items-center rounded-sm border border-transparent bg-muted/70 px-2.5 transition-colors duration-200 min-[400px]:px-3 hover:bg-muted focus-within:border-primary focus-within:bg-card focus-within:ring-2 focus-within:ring-ring/30 motion-reduce:transition-none',
          effectiveOpen ? '' : 'cursor-pointer',
        ].join(' ')}
      >
        <button
          type="button"
          className="inline-flex shrink-0 skew-x-12 cursor-pointer touch-manipulation rounded-md text-muted-foreground outline-none transition-colors duration-200 group-focus-within:text-primary focus-visible:ring-2 focus-visible:ring-ring"
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
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setKeyword('')
              if (collapsibleChrome) {
                setOpen(false)
                inputRef.current?.blur()
              }
            }
          }}
          placeholder={t('searchPlaceholder')}
          aria-keyshortcuts={isDesktopNav ? 'Meta+K Control+K' : undefined}
          className={[
            'ml-2 min-w-0 flex-1 skew-x-12 cursor-text bg-transparent text-sm text-foreground outline-none transition-opacity duration-200 placeholder:text-muted-foreground',
            effectiveOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
          ].join(' ')}
        />
        {isDesktopNav && shortcutLabel && !keyword && (
          <kbd
            aria-hidden="true"
            className="ml-2 inline-flex shrink-0 skew-x-12 items-center rounded-sm border border-border bg-background px-1.5 py-0.5 font-sans text-xs font-medium text-muted-foreground"
          >
            {shortcutLabel}
          </kbd>
        )}
      </div>

      {/* HASIL — jajar genjang seperti kolom search (tepi sejajar); isi dimiringkan balik supaya tegak */}
      {effectiveOpen && debouncedKeyword && (
        <div className="absolute left-0 right-0 top-12 z-50 -skew-x-12 overflow-hidden rounded-sm border border-border bg-popover text-popover-foreground shadow-xl">
          <div aria-hidden className="h-0.5 bg-gradient-brand" />
          <div className="max-h-[min(22rem,70vh)] overflow-y-auto overflow-x-hidden p-1.5">
            {isLoading && (
              <div role="status" className="flex skew-x-12 items-center gap-3 px-3 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
                <span>{t('searching')}</span>
              </div>
            )}

            {!isLoading && games.length === 0 && (
              <div role="status" className="flex skew-x-12 flex-col items-center gap-2 px-4 py-6 text-center">
                <StateGlyph glyph={STATE_GLYPH.notFound} tone="muted" size="md" />
                <p className="text-sm text-muted-foreground">{t('gameNotFound')}</p>
              </div>
            )}

            {!isLoading && games.length > 0 && (
              <ul className="flex flex-col gap-0.5">
                {games.slice(0, 5).map((game) => (
                  <li key={game.id}>
                    <Link
                      onClick={() => {
                        setKeyword('')
                        setOpen(false)
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      href={`/games/${game.slug}`}
                      className="group relative flex items-center gap-3 rounded-sm px-3 py-2 transition-colors duration-150 hover:bg-primary/10 focus-visible:bg-primary/10 focus-visible:outline-none"
                    >
                      {/* Aksen kiri saat hover/fokus keyboard */}
                      <span
                        aria-hidden
                        className="absolute inset-y-1.5 left-0 w-0.5 bg-primary opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                      />
                      <span className="flex min-w-0 flex-1 skew-x-12 items-center gap-3">
                        <span className="chamfer relative h-11 w-11 shrink-0 overflow-hidden bg-muted [--chamfer:8px]">
                          {game.thumbnail_url ? (
                            <Image
                              src={game.thumbnail_url}
                              alt=""
                              fill
                              sizes="44px"
                              unoptimized={!canOptimize(game.thumbnail_url)}
                              className="object-cover"
                            />
                          ) : (
                            // Tanpa thumbnail: inisial nama game, sama seperti GameTile & TransactionThumb
                            <span
                              aria-hidden
                              className="flex h-full w-full items-center justify-center font-display text-sm font-bold text-muted-foreground"
                            >
                              {getInitials(game.name)}
                            </span>
                          )}
                        </span>
                        <span className="truncate font-display text-sm font-semibold text-foreground transition-colors duration-150 group-hover:text-primary">
                          {game.name}
                        </span>
                      </span>
                      <ChevronRight
                        className="h-4 w-4 shrink-0 skew-x-12 text-primary opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
