'use client'

import { Link, useRouter } from '../../i18n/routing'
import { useParams } from 'next/navigation'
import { Star, Shield, Zap, Monitor, ArrowLeft, Heart, ShoppingCart, Check } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { gamesData } from '../../data/gamesData'

export function GameDetail() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const game = gamesData.find((g) => g.id === id)
  const { addToCart } = useCart()
  const t = useTranslations('GameDetail')

  if (!game) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Game not found</h2>
          <Link href="/games" className="text-purple-400 hover:text-purple-300">
            {t('back')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Banner */}
      <div className="relative h-[60vh] md:h-[80vh]">
        <div className="absolute inset-0">
          <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1016] via-[#0f1016]/50 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-12">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 backdrop-blur-md bg-black/20 px-4 py-2 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('back')}
            </Link>

            <div className="flex flex-col md:flex-row gap-8 items-end">
              <div className="flex-1 space-y-4">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-purple-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-purple-500/20">
                    {game.category}
                  </span>
                  {game.discount && (
                    <span className="px-3 py-1 bg-pink-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-pink-500/20">
                      -{game.discount}%
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                  {game.title}
                </h1>

                <div className="flex items-center gap-6 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-bold text-white">{game.rating}</span>
                    <span className="text-sm">(2.4k Reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span>Official License</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 space-y-4">
                <div className="space-y-1">
                  {game.discount && (
                    <div className="text-gray-400 line-through text-sm">
                      Rp {Math.round(game.price * 1.5).toLocaleString()}
                    </div>
                  )}
                  <div className="text-3xl font-bold text-white">
                    Rp {game.price.toLocaleString()}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-white cursor-pointer text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    {t('buyNow')}
                  </button>
                  <button className="bg-white/10 hover:bg-white/20  cursor-pointer text-white p-3 rounded-xl transition-colors">
                    <Heart className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Monitor className="w-6 h-6 text-purple-400" />
                {t('description')}
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 text-lg leading-relaxed">
                  Experience the ultimate {game.category} adventure in {game.title}. Immerse
                  yourself in a stunning world filled with detailed environments, complex
                  characters, and engaging gameplay mechanics that will keep you hooked for hours.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                    <h3 className="text-white font-bold mb-2">Immersive World</h3>
                    <p className="text-sm text-gray-400">
                      Explore vast landscapes and detailed environments
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                    <h3 className="text-white font-bold mb-2">Epic Combat</h3>
                    <p className="text-sm text-gray-400">
                      Master unique abilities and powerful weapons
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-white font-bold mb-4">Why Buy from Us?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Instant Delivery</h4>
                    <p className="text-sm text-gray-400">Get your key immediately after payment</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Secure Payment</h4>
                    <p className="text-sm text-gray-400">
                      100% secure transaction with basic encryption
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
