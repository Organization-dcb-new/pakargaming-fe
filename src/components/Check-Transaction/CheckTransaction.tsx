'use client'

import { useEffect, useState } from 'react'
import { useGetTransactionByPaymentNumber } from './hooks/useGetTransaction'
import { useRouter } from 'next/navigation'

export default function CheckTransaction() {
  const [invoice, setInvoice] = useState('')
  const [trxId, setTrxId] = useState('')
  const router = useRouter()

  const { data, isLoading } = useGetTransactionByPaymentNumber(trxId)

  const regex = /^PAY-\d{10,}$/
  const isValid = regex.test(invoice)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setTrxId(invoice)
  }

  useEffect(() => {
    if (data?.data?.id) {
      router.push(`/en/detail-trx/${data.data.id}`)
    }
  }, [data, router])

  return (
    <section className="relative overflow-hidden py-20 px-4 min-h-screen flex justify-center items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-500/10 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            Cek Invoice Kamu <span className="text-purple-600">dengan Mudah</span> dan Cepat
          </h1>

          <p className="mt-4 text-gray-600 dark:text-gray-400 text-base">
            Lihat detail pembelian kamu menggunakan nomor Invoice tanpa perlu login. Proses cepat,
            aman, dan real-time.
          </p>

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-500">
            Contoh format:{' '}
            <span className="font-semibold text-purple-600">PAY-1770XXXXXXXXXXX</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl blur opacity-20"></div>

          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Cari detail pembelian kamu disini
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={invoice}
                  onChange={(e) => setInvoice(e.target.value.toUpperCase())}
                  placeholder="PAY-XXXXXXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />

                {invoice && !isValid && (
                  <p className="mt-2 text-sm text-red-500">Format harus PAY- diikuti angka</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full py-3  cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Mencari...' : 'Cari Invoice'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
