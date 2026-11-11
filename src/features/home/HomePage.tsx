'use client'

import BannerComponent from '@/features/home/components/BannerCarousel'
import GamesByShow from '@/features/home/components/GamesByShow'

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Banner promo — container sama lebar dengan navbar */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 md:pt-8 lg:px-8">
        <BannerComponent />
      </section>
      {/* Game Show  */}
      <div className="pt-4 md:pt-6">
        <GamesByShow />
      </div>
    </div>
  )
}
