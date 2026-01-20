'use client'

import useAuth from '../../../components/Navigation'
import { useGetTransactionByEmail } from '../../../hooks/useTransaction'
import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'

export default function MyTransaction() {
  const { user, loading } = useAuth()
  const email = user?.email

  const [page, setPage] = useState(1)
  const { data, isLoading } = useGetTransactionByEmail(email, page)
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'id'

  if (loading || isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-purple-50/50 dark:via-purple-900/50 to-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  const transactions = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br  justify-center  items-center from-background via-purple-50/50 dark:via-purple-900/50 to-background p-4 sm:p-5">
      <h1 className="text-2xl font-semibold mb-6 flex items-center justify-center w-full mt-5">
        My <span className="text-purple-600 dark:text-purple-400">Transaction</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4  max-w-[980px]">
        {transactions.length === 0 && (
          <p className="col-span-full text-center text-slate-500 dark:text-slate-400">
            No transactions found
          </p>
        )}

        {transactions.map((trx) => (
          <div
            key={trx.id}
            onClick={() => router.push(`/${locale}/detail-trx/${trx.id}`)}
            className="cursor-pointer  bg-white dark:bg-slate-900  dark:border-slate-800 rounded-xl shadow-sm p-3 sm:p-4 flex flex-row transition hover:shadow-lg"
          >
            {/* Left Column */}
            <div className="flex flex-col w-full gap-4 ">
              {/* Date */}
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {new Date(trx.created_at).toLocaleDateString('id-ID', {
                  minute: '2-digit',
                  hour: '2-digit',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>

              <div className="flex flex-row gap-3 items-start">
                <img
                  src={trx.game_image}
                  alt="image"
                  className="w-20 h-20 rounded-lg object-cover bg-slate-100 dark:bg-slate-800"
                />

                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {trx.game_name}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {trx.game_item}
                  </p>
                </div>
              </div>

              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                {trx.payment_number}
              </p>
            </div>

            {/* Right Column */}
            <div className="flex flex-col min-w-32 justify-between items-end">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full
      ${
        trx.status === 'PAID'
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
          : trx.status === 'PENDING'
            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
            : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
      }
    `}
              >
                {trx.status}
              </span>

              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Rp {trx.amount.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {meta && meta.total_page > 1 && (
        <div className="flex items-center justify-between mt-6 px-2 sm:px-4">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {meta.page} of {meta.total_page}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 cursor-pointer dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Prev
            </button>

            <button
              disabled={page === meta.total_page}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 cursor-pointer dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
