'use client'

import BannerComponent from './Banner/Banner'
import GamesByShow from './Game/GamesByShow'

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <BannerComponent />
      {/* Game Show  */}
      <GamesByShow />

      {/* Stats Section
      <Stats /> */}
    </div>
  )
}
