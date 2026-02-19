'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { useGetGameBySearch } from '../../hooks/useGame'
import { Link } from '../../i18n/routing'

export default function SearchComponent() {
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword] = useDebounce(keyword, 400)
  const [open, setOpen] = useState(false)

  const { data, isLoading } = useGetGameBySearch(debouncedKeyword)
  const games = data?.data ?? []

  return (
    <div
      className={`
    relative transition-all duration-300
    w-12
    ${open ? 'w-72' : 'w-12'}
    lg:!w-170
  `}
    >
      {/* INPUT */}
      <div className="flex items-center h-10 px-3 rounded-full border border-purple-500/30 bg-white dark:bg-black/30 shadow-sm">
        <Search
          size={18}
          className="text-purple-600 dark:text-purple-400 shrink-0 cursor-pointer"
          onClick={() => setOpen(true)}
        />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            if (!keyword) setOpen(false)
          }}
          placeholder="Search Game..."
          className={`
    ml-2 w-full bg-transparent text-sm outline-none
    transition-all duration-300
    ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    sm:opacity-100 sm:pointer-events-auto
  `}
        />
      </div>

      {/* PREVIEW */}
      {debouncedKeyword && (
        <div className="absolute top-12 left-0 right-0 z-50 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
          {isLoading && (
            <div className="p-4 flex items-center gap-3 text-sm text-gray-500">
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Searching...</span>
            </div>
          )}

          {!isLoading && games.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Game not found</p>
            </div>
          )}

          {!isLoading && games.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              {games.slice(0, 5).map((game) => (
                <Link
                  onClick={() => setKeyword('')}
                  key={game.id}
                  href={`/games/${game.slug}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-200 border-b border-gray-100 dark:border-gray-800 last:border-b-0 group"
                >
                  {/* Game Image */}
                  <div className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-purple-400 dark:group-hover:ring-purple-500 transition-all">
                    {game.thumbnail_url ? (
                      <img
                        src={game.thumbnail_url}
                        alt={game.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Game Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {game.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
