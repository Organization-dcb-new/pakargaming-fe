'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useGetBanners } from '../../hooks/useBanner'
import { Banner } from '../../types/Banner'
import { ShowSkeleton } from './Loading'
import ErrorBanner from './Error'
import EmptyBanner from './Empty'
import LayoutBanner from './Layout'

const AUTOPLAY_DELAY = 5000

export default function BannerCarousel() {
  const { data, isLoading, isError } = useGetBanners()
  const banners: Banner[] = data?.data ?? []
  const total = banners.length

  const [index, setIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Fix index kalau data berubah
  useEffect(() => {
    if (index >= total) setIndex(0)
  }, [index, total])

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  // Autoplay (pause on hover)
  useEffect(() => {
    if (total === 0 || isHovering) return

    timerRef.current = setInterval(next, AUTOPLAY_DELAY)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [next, total, isHovering])

  if (isLoading) return <ShowSkeleton />
  if (isError) return <ErrorBanner />
  if (total === 0) return <EmptyBanner />

  return (
    <LayoutBanner>
      <div
        className="group relative overflow-hidden "
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}>
        {/* SLIDES */}
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}>
          {banners.map((banner, i) => (
            <div
              key={banner.id}
              className="
    w-full flex-shrink-0 relative
    h-[140px]
    sm:h-[220px]
    md:h-[340px]
  ">
              <a
                href={banner.redirect_link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Banner ${i + 1}`}>
                <Image
                  src={banner.image || "/placeholder.png"}
                  alt="Banner"
                  fill
                  priority={i === 0}
                  className="object-cover"
                  unoptimized={true}
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              </a>
            </div>
          ))}
        </div>

        {/* NAVIGATION */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="
  absolute left-4 top-1/2 -translate-y-1/2
  rounded-full bg-black/30 p-2 text-white backdrop-blur
  transition
  opacity-100
  sm:opacity-0 sm:group-hover:opacity-100
">
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={next}
          aria-label="Next slide"
          className="
  absolute right-4 top-1/2 -translate-y-1/2
  rounded-full bg-black/30 p-2 text-white backdrop-blur
  transition
  opacity-100
  sm:opacity-0 sm:group-hover:opacity-100
">
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* DOTS */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                index === i ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </LayoutBanner>
  );
}
