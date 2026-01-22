'use client'

import { useGetShows } from '../../hooks/useShow'
import { useEffect, useState } from 'react'
import { GamesByShowSkeleton } from './Loading'
import NavigationShowGame from './Navigation'
import ShowSectionGames from './ShowSection'

export default function GamesByShow() {
  const { data, isLoading } = useGetShows()
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
