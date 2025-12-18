'use client'

import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { CreditCard, Wallet, Smartphone, ShieldCheck, Gamepad2, AlertCircle } from 'lucide-react'
import { useRouter, Link } from '../../i18n/routing'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

type PaymentMethod = 'credit-card' | 'e-wallet' | 'bank-transfer'

export function Payment() {
  const { cart, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const t = useTranslations('Payment')
  const tCommon = useTranslations('Common')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  })

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setLoading(false)
    clearCart()
    toast.success('Pembayaran berhasil!')
    router.replace('/')
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">{t('orderDetail')}</p>
          <Link href="/cart" className="text-purple-400 hover:text-purple-300 transition-colors">
            {t('backToCart')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">{t('title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 border border-white/5 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-purple-400" />
                {t('orderDetail')}
              </h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {item.quantity} x Rp {item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-white font-medium">
                      Rp {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-white/5 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-400" />
                {t('paymentMethod')}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('credit-card')}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'credit-card'
                      ? 'bg-purple-500/20 border-purple-500 text-white'
                      : 'bg-black/20 border-white/10 text-gray-400 hover:bg-black/40'
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-sm font-medium">Credit Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('e-wallet')}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'e-wallet'
                      ? 'bg-purple-500/20 border-purple-500 text-white'
                      : 'bg-black/20 border-white/10 text-gray-400 hover:bg-black/40'
                  }`}
                >
                  <Wallet className="w-6 h-6" />
                  <span className="text-sm font-medium">E-Wallet</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('bank-transfer')}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'bank-transfer'
                      ? 'bg-purple-500/20 border-purple-500 text-white'
                      : 'bg-black/20 border-white/10 text-gray-400 hover:bg-black/40'
                  }`}
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="text-sm font-medium">QRIS / VA</span>
                </button>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">
                  Pembayaran Anda dijamin aman. Kami menggunakan enkripsi SSL untuk melindungi data
                  Anda.
                </p>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-white/5 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">{t('buyerInfo')}</h2>
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">{t('fullName')}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">{t('email')}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="border-t border-white/10 pt-4 mt-6">
                  <div className="flex justify-between items-center text-lg font-bold text-white mb-6">
                    <span>{t('totalPayment')}</span>
                    <span>Rp {Math.round(getTotalPrice() * 1.1).toLocaleString()}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        {t('processing')}
                      </>
                    ) : (
                      t('payNow')
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
