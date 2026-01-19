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
      <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-6">
        Loading...
      </div>
    )
  }

  const transactions = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="min-h-screen bg-purple-50 text-slate-900 dark:bg-purple-950 dark:text-slate-100 p-6">
      <h1 className="text-2xl font-semibold mb-6">
        My <span className="text-purple-600 dark:text-purple-400">Transaction</span>
      </h1>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Transaction ID</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Amount</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-slate-500 dark:text-slate-400"
                >
                  No transactions found
                </td>
              </tr>
            )}

            {transactions.map((trx) => (
              <tr key={trx.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/60 transition">
                <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                  {trx.payment_number}
                </td>

                <td className="px-4 py-3">
                  {new Date(trx.created_at).toLocaleDateString('id-ID')}
                </td>

                <td className="px-4 py-3 font-semibold">Rp {trx.amount.toLocaleString('id-ID')}</td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium
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
                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => router.push(`/${locale}/transaction/${trx.id}`)}
                    className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {meta && meta.total_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Page {meta.page} of {meta.total_page}
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 cursor-pointer
                           dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Prev
              </button>

              <button
                disabled={page === meta.total_page}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 cursor-pointer
                           dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
