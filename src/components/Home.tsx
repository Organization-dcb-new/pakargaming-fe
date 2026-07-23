'use client'

import BannerComponent from './Banner/Banner'
import GamesByShow from './Home/GamesByShow'
import BlogSection from './Home/BlogSection'

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <BannerComponent />
      {/* Game Show  */}
      <GamesByShow />
      {/* Blog & Gaming News Section */}
      <BlogSection />
    </div>
  )
}
