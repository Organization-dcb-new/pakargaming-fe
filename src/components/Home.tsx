'use client'

import { Link } from '../i18n/routing'
import { ArrowRight, Star, TrendingUp, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { gamesResponse } from '../data/gamesData'
import Image from 'next/image'

const featuredGames = gamesResponse.data.slice(0, 3)

export function Home() {
  const t = useTranslations('Home')

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cHxlbnwxfHx8fDE3NjU3OTAwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-purple-900/50 to-black/80 dark:from-black/80 dark:via-purple-900/50 dark:to-black/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 dark:bg-purple-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-purple-700 dark:text-purple-300 mb-6">
              <Zap className="w-4 h-4" />
              <span>{t('specialPromo')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl text-white mb-6">{t('heroTitle')}</h1>
            <p className="text-gray-200 dark:text-gray-300 text-lg md:text-xl mb-8">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/games"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2 group"
              >
                {t('browseGames')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="border border-purple-500 dark:border-purple-500 text-purple-100 dark:text-purple-300 px-8 py-4 rounded-lg hover:bg-purple-500/20 dark:hover:bg-purple-500/20 transition-all">
                {t('viewPromo')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wider">{t('trending')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl text-gray-900 dark:text-white">
              {t('popularGames')}
            </h2>
          </div>
          <Link
            href="/games"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-2 group"
          >
            {t('viewAll')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGames.map((game) => (
            <div
              key={game.id}
              className="group bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-200 dark:border-purple-500/20 hover:border-purple-400 dark:hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/20"
            >
              <Link href={`/games/${game.id}`} className="block">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={game.thumbnail_url}
                    alt={game.name}
                    fill
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4"></div>
                </div>
              </Link>

              <div className="p-6">
                <Link href={`/games/${game.id}`}>
                  <h3 className="text-xl text-gray-900 dark:text-white mb-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {game.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between">
                  <div></div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                    }}
                    className="bg-gradient-to-r from-purple-500 cursor-pointer to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    {t('buy')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50/80 dark:bg-black/40 backdrop-blur-sm border-y border-purple-200 dark:border-purple-500/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Game Tersedia', value: '10,000+' },
              { label: 'Pengguna Aktif', value: '5M+' },
              { label: 'Rating Rata-rata', value: '4.8' },
              { label: 'Diskon Hingga', value: '70%' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
