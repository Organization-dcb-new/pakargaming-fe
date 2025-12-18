'use client'

import { useCart } from '../context/CartContext'
import { Trash2, ArrowRight } from 'lucide-react'
import { Link } from '../i18n/routing'
import { useTranslations } from 'next-intl'

export function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart()
  const t = useTranslations('Cart')

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">{t('empty')}</h2>
          <Link
            href="/games"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all group"
          >
            {t('continue')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">{t('title')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/50 border border-white/5 rounded-xl p-4 flex gap-4"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-bold">{item.title}</h3>
                      <p className="text-purple-400 text-sm">{item.category}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3 bg-black/20 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                      >
                        -
                      </button>
                      <span className="text-white font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-white font-bold">
                      Rp {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-1">
            <div className="bg-slate-800/50 border border-white/5 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Ringkasan</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>{t('subtotal')}</span>
                  <span>Rp {getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>{t('tax')}</span>
                  <span>Rp {Math.round(getTotalPrice() * 0.1).toLocaleString()}</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>{t('total')}</span>
                  <span>Rp {Math.round(getTotalPrice() * 1.1).toLocaleString()}</span>
                </div>
              </div>
              <Link
                href="/payment"
                className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                {t('checkout')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
