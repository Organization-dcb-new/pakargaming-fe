'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useGetBanners } from '../../hooks/useBanner'
import { Banner } from '../../types/Banner'
import { ShowSkeleton } from './BannerSkeleton'

const AUTOPLAY_DELAY = 5000

export default function BannerCarousel() {
  const { data, isLoading, isError } = useGetBanners()
  const [index, setIndex] = useState(0)
  const banners: Banner[] = data?.data || []

  const total = banners.length

  // Next slide
  const next = useCallback(() => {
    setIndex((prev) => (prev + 1 >= total ? 0 : prev + 1))
  }, [total])

  // Previous slide
  const prev = () => {
    setIndex((prev) => (prev - 1 < 0 ? total - 1 : prev - 1))
  }

  // Autoplay
  useEffect(() => {
    if (total === 0) return
    const timer = setInterval(next, AUTOPLAY_DELAY)
    return () => clearInterval(timer)
  }, [next, total])

  // Loading / Error / Empty state
  if (isLoading) return <ShowSkeleton />
  if (isError) {
    return (
      <div className="py-10 flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-semibold text-red-600">Failed to load Content</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 cursor-pointer rounded-md bg-red-500 px-4 py-2 text-xs text-white hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (total === 0) {
    return (
      <div className="py-10 flex justify-center  items-center min-h-screen">
        <div className="rounded-xl border border-dashed bg-gray-50 px-6 py-8 text-center">
          <p className="text-sm font-medium text-gray-600">No banners available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      <div className="relative group overflow-hidden rounded-2xl bg-gray-100 shadow-2xl">
        {/* TRACK */}
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="w-full flex-shrink-0 relative aspect-[16/9] md:aspect-[21/9]"
            >
              <a href={banner.redirect_link} target="_blank">
                <Image
                  src={banner.image}
                  alt={banner.redirect_link || 'banner'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.png'
                  }}
                />
              </a>
            </div>
          ))}
        </div>

        {/* NAVIGATION ARROWS */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 md:p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 md:p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* PAGINATION DOTS */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 transition-all duration-300 rounded-full ${
                index === i ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
