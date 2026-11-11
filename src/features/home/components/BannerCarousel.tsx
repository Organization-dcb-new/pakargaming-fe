'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useGetBanners } from '@/features/home/api/useGetBanners'
import { Banner } from '@/features/home/types/banner'
import { BannerSkeleton } from './BannerSkeleton'
import BannerError from './BannerError'
import BannerEmpty from './BannerEmpty'
import BannerFrame from './BannerFrame'
import { BANNER_IMAGE_HEIGHT, BANNER_IMAGE_WIDTH } from '@/features/home/lib/bannerDimensions'
import { canOptimize } from '@/lib/image'

const AUTOPLAY_DELAY = 5000

export default function BannerCarousel() {
  const t = useTranslations('Home')
  const { data, isLoading, isError, refetch } = useGetBanners()
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

  // Autoplay (pause on hover). `index` ikut deps supaya timer di-reset saat user
  // pindah slide manual — sinkron dengan progress bar yang juga restart per slide.
  useEffect(() => {
    if (total <= 1 || isHovering) return

    timerRef.current = setInterval(next, AUTOPLAY_DELAY)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [next, total, isHovering, index])

  if (isLoading) return <BannerSkeleton />
  if (isError) return <BannerError onRetry={() => refetch()} />
  if (total === 0) return <BannerEmpty />

  return (
    <BannerFrame>
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
                aria-label={t('bannerLinkLabel', { index: i + 1, total })}>
                <Image
                  src={banner.image || "/placeholder.png"}
                  alt={t('bannerLinkLabel', { index: i + 1, total })}
                  fill
                  priority={i === 0}
                  className="object-cover"
                  unoptimized={!canOptimize(banner.image || "/placeholder.png")}
                  sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1280px) calc(100vw - 4rem), 1216px"
                />
              </a>
            </div>
          ))}
        </div>

        {/* Scrim bawah-kanan: kontrol HUD tetap terbaca di atas gambar terang */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-black/50 via-black/15 to-transparent sm:h-24"
          aria-hidden
        />

        {/* KONTROL HUD (pojok kanan bawah) — tidak relevan saat banner cuma satu */}
        {total > 1 && (
          <div className="absolute bottom-2 right-3 z-20 flex items-center gap-2.5 sm:bottom-4 sm:right-6 sm:gap-4">
            <span aria-hidden className="font-display text-xs font-bold tabular-nums tracking-widest text-white/70">
              <span className="text-white">{String(index + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
            </span>

            {/* Segmen jajar genjang; yang aktif terisi sesuai waktu autoplay. Area sentuh lebih besar dari visualnya. */}
            <div className="flex items-center">
              {banners.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={t('goToSlide', { index: i + 1 })}
                  aria-current={index === i ? 'true' : undefined}
                  className="group/seg touch-manipulation px-1 py-3 focus-visible:outline-none"
                >
                  <span
                    className={`relative block h-2 -skew-x-12 overflow-hidden transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none group-focus-visible/seg:ring-2 group-focus-visible/seg:ring-white ${
                      index === i ? 'w-10 bg-white/35' : 'w-5 bg-white/45 group-hover/seg:bg-white/75'
                    }`}
                  >
                    {index === i && (
                      <span
                        // isHovering ikut key: saat hover selesai, bar & timer JS sama-sama
                        // restart dari 0 sehingga progress tetap jujur terhadap autoplay
                        key={`p-${index}-${isHovering}`}
                        aria-hidden
                        className="absolute inset-0 origin-left bg-primary animate-[banner-progress_5s_linear_forwards] group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:scale-x-100"
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              {[
                { onClick: prev, label: t('prevSlide'), Icon: ChevronLeft },
                { onClick: next, label: t('nextSlide'), Icon: ChevronRight },
              ].map(({ onClick, label, Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  aria-label={label}
                  className="flex h-9 w-10 -skew-x-12 touch-manipulation items-center justify-center rounded-sm border border-white/20 bg-black/40 text-white backdrop-blur-md transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Icon className="h-5 w-5 skew-x-12" strokeWidth={2.25} aria-hidden />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </BannerFrame>
  );
}
