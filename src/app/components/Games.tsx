'use client'

import { Link } from '../../i18n/routing'
import { Search, Filter, SlidersHorizontal, Star } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { gamesData } from '../../data/gamesData'

export function Games() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const t = useTranslations('Games')
  const categories = ['All', 'Action', 'RPG', 'Adventure', 'Strategy', 'Racing']
  

  const filteredGames = gamesData
    .filter((game) => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return b.rating - a.rating
    })

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto mb-12 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-600">
            {t('title')}
          </h1>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-500 transition-colors" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 dark:bg-black/40 border border-purple-200 dark:border-purple-500/20 rounded-full py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-all placeholder-gray-500"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-purple-200 dark:border-purple-500/10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm ${
                  selectedCategory === category
                    ? 'bg-purple-600 dark:bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5'
                }`}
              >
                {category === 'All' ? t('allCategories') : category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <SlidersHorizontal className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-100 dark:bg-black/40 border border-purple-200 dark:border-purple-500/20 rounded-lg py-2 px-4 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 text-sm w-full md:w-auto cursor-pointer hover:bg-gray-200 dark:hover:bg-black/60 transition-colors"
            >
              <option value="featured">{t('sortBy')}</option>
              <option value="price-asc">{t('priceAsc')}</option>
              <option value="price-desc">{t('priceDesc')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.map((game, index) => (
          <Link
            href={`/games/${game.id}`}
            key={game.id}
            className="group relative bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-white/5 hover:border-purple-400 dark:hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <div className="aspect-[16/9] overflow-hidden relative">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {game.discount && (
                <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                  -{game.discount}%
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-purple-600 dark:text-purple-400 text-xs font-medium bg-purple-100 dark:bg-purple-500/10 px-2 py-1 rounded">
                  {game.category}
                </span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-sm font-bold">{game.rating}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {game.title}
              </h3>

              <div className="flex justify-between items-end mt-4">
                <div>
                  {game.discount ? (
                    <div className="flex flex-col">
                      <span className="text-gray-500 dark:text-gray-500 text-xs line-through">
                        Rp {Math.round(game.price * 1.5).toLocaleString()}
                      </span>
                      <span className="text-gray-900 dark:text-white font-bold">
                        Rp {game.price.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-900 dark:text-white font-bold">
                      Rp {game.price.toLocaleString()}
                    </span>
                  )}
                </div>
                <button className="bg-gray-200 dark:bg-white/10 hover:bg-purple-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                  {t('detail')}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
