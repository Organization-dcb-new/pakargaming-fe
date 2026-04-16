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
import { BANNER_IMAGE_HEIGHT, BANNER_IMAGE_WIDTH } from './bannerDimensions'

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
        className="group relative isolate overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}>
        {/* SLIDES */}
        <div
          className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none motion-reduce:duration-0"
          style={{ transform: `translateX(-${index * 100}%)` }}>
          {banners.map((banner, i) => (
            <div
              key={banner.id}
              className="relative w-full min-w-full flex-shrink-0"
              style={{
                aspectRatio: `${BANNER_IMAGE_WIDTH} / ${BANNER_IMAGE_HEIGHT}`,
              }}>
              <a
                href={banner.redirect_link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 block outline-none ring-inset focus-visible:ring-2 focus-visible:ring-white/90"
                aria-label={`Banner ${i + 1}`}>
                <Image
                  src={banner.image || "/placeholder.png"}
                  alt="Banner"
                  fill
                  priority={i === 0}
                  className="object-cover"
                  unoptimized={true}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) calc(100vw - 2rem), min(1024px, 100vw - 2rem)"
                />
              </a>
            </div>
          ))}
        </div>

        {/* Bottom scrim: keeps dots legible on bright imagery */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-24 bg-gradient-to-t from-black/55 via-black/20 to-transparent"
          aria-hidden
        />

        {/* NAVIGATION */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-white/15 bg-black/35 text-white shadow-lg backdrop-blur-md transition-[opacity,transform,background-color] duration-300 hover:bg-black/50 active:scale-95 motion-reduce:active:scale-100 opacity-100 sm:left-4 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30">
          <ChevronLeft className="h-6 w-6 shrink-0" strokeWidth={2} aria-hidden />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-white/15 bg-black/35 text-white shadow-lg backdrop-blur-md transition-[opacity,transform,background-color] duration-300 hover:bg-black/50 active:scale-95 motion-reduce:active:scale-100 opacity-100 sm:right-4 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30">
          <ChevronRight className="h-6 w-6 shrink-0" strokeWidth={2} aria-hidden />
        </button>

        {/* DOTS */}
        <div className="absolute bottom-4 left-1/2 z-[2] flex -translate-x-1/2 gap-2.5 px-2">
          {banners.map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={index === i ? 'true' : undefined}
              className={`touch-manipulation rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 ${
                index === i
                  ? 'h-2.5 w-8 bg-white shadow-[0_0_12px_rgba(255,255,255,0.45)]'
                  : 'h-2.5 w-2.5 bg-white/45 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>
    </LayoutBanner>
  );
}
