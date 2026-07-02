'use client'

import { useGetShows } from '../../hooks/useShow'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AlertTriangle, Gamepad2 } from 'lucide-react'
import { GamesByShowSkeleton } from './Loading'
import NavigationShowGame from './Navigation'
import ShowSectionGames from './ShowSection'

// Harus ≥ scroll-mt-36 section (144px); kalau lebih kecil, section target berhenti
// di 144px dan tidak pernah lolos threshold — chip sebelumnya yang ikut aktif.
const SCROLLSPY_OFFSET = 160

export default function GamesByShow() {
  const { data, isLoading, isError, refetch } = useGetShows()
  const t = useTranslations('Home')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isNavSticky, setIsNavSticky] = useState(false)
  const suppressSpyRef = useRef(false)
  const suppressTimerRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return

    // Bekukan scrollspy selama smooth-scroll programatik supaya chip yang diklik
    // tidak ditimpa section perantara yang terlewati.
    suppressSpyRef.current = true
    if (suppressTimerRef.current) clearTimeout(suppressTimerRef.current)
    const release = () => {
      suppressSpyRef.current = false
      window.removeEventListener('scrollend', release)
    }
    window.addEventListener('scrollend', release)
    suppressTimerRef.current = setTimeout(release, 1200) // fallback browser tanpa 'scrollend'

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    setSelectedId(id)
  }
  const shows = (data?.data ?? []).filter((show) => show.is_show)

  useEffect(() => {
    const handleScroll = () => {
      // Check if navigation is stuck (scrolled past navbar)
      const navElement = document.getElementById('show-navigation')
      if (navElement) {
        const navTop = navElement.getBoundingClientRect().top
        // Assuming navbar height is 56px (top-14) or 64px (top-16)
        setIsNavSticky(navTop <= 64)
      }

      if (suppressSpyRef.current) return

      // Update selected show based on scroll position
      let currentId: string | null = null
      shows.forEach((show) => {
        const el = document.getElementById(`show-${show.id}`)
        if (el) {
          const top = el.getBoundingClientRect().top
          if (top <= SCROLLSPY_OFFSET) {
            currentId = `show-${show.id}`
          }
        }
      })
      if (currentId) setSelectedId(currentId)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (suppressTimerRef.current) clearTimeout(suppressTimerRef.current)
    }
  }, [shows])

  if (isLoading) return <GamesByShowSkeleton />

  if (isError) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-3">
        <span className="rounded-full bg-destructive/10 p-3">
          <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden />
        </span>
        <h2 className="text-base font-semibold text-foreground">
          {t('showsErrorTitle')}
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          {t('showsErrorDesc')}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full bg-gradient-brand px-5 py-2 text-sm font-semibold text-brand-foreground hover:brightness-110 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          {t('retry')}
        </button>
      </section>
    )
  }

  if (shows.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-3">
        <span className="rounded-full bg-muted p-3">
          <Gamepad2 className="h-6 w-6 text-muted-foreground" aria-hidden />
        </span>
        <p className="text-sm text-muted-foreground">{t('showsEmpty')}</p>
      </section>
    )
  }

  return (
    <section className="w-full">
      <NavigationShowGame
        isNavSticky={isNavSticky}
        scrollToSection={scrollToSection}
        selectedId={selectedId}
        shows={shows}
      />
      <ShowSectionGames shows={shows} />
    </section>
  )
}
