'use client'

import React from 'react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { CheckCircle, XCircle, Clock, Wallet, Activity, AlertCircle } from 'lucide-react'
import { GetTransactionResponsesDashboard } from '../hooks/useGetTransaction'
import { PaymentResponseDetail } from '../types/transactions'
import { useRouter } from 'next/navigation'

interface MyTransactionProps {
  DataDashboard: GetTransactionResponsesDashboard
  isLoading: boolean
}
export default function MyTransaction({ DataDashboard, isLoading }: MyTransactionProps) {
  const router = useRouter()

  const data: PaymentResponseDetail[] = React.useMemo(
    () =>
      isLoading
        ? Array.from({ length: 5 }).map((_, i) => ({
            id: `${i + 1}`,
            payment_number: '...',
            order_id: '...',
            amount: 0,
            status: 'Pending',
            payment_method_id: '...',
            payment_channel: '...',
            payment_url: '...',
            game_name: '...',
            game_image: '...',
            game_item: '...',
            guide: {} as any,
            created_at: '...',
          }))
        : DataDashboard?.data?.transaction_detail || [],
    [DataDashboard, isLoading]
  )

  const hasData = data.length > 0

  const columns = React.useMemo<ColumnDef<PaymentResponseDetail>[]>(
    () => [
      {
        accessorKey: 'payment_number',
        header: 'Payment Number',
        cell: ({ row, getValue }) => {
          const value = getValue() as string
          const id = row.original.id

          return hasData ? (
            <span
              className="text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline"
              onClick={() => router.push(`/en/detail-trx/${id}`)}
            >
              {value}
            </span>
          ) : (
            '-'
          )
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Tanggal',
        cell: ({ getValue }) => {
          const dateStr = getValue() as string
          return hasData ? <span>{dateStr.split('.')[0]}</span> : '-'
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ getValue }) =>
          hasData ? (
            <span>
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
              }).format(getValue() as number)}
            </span>
          ) : (
            '-'
          ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) =>
          hasData ? <StatusBadge status={getValue() as string} /> : <span>-</span>,
      },
    ],
    [hasData]
  )

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="p-4 lg:p-6 space-y-6 font-sans">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ringkasan Transaksi</h1>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatCard
          title="Total Transactions"
          value={DataDashboard?.data?.total_transactions || 0}
          icon={Activity}
          color="indigo"
        />
        <StatCard
          title="Total Amount"
          value={
            DataDashboard?.data?.total_amount
              ? `Rp ${DataDashboard.data.total_amount.toLocaleString('id-ID')}`
              : 'Rp 0'
          }
          icon={Wallet}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="PENDING"
          value={DataDashboard?.data?.transactions_pending || 0}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="FAILED"
          value={DataDashboard?.data?.transactions_failed || 0}
          icon={AlertCircle}
          color="rose"
        />
        <StatCard
          title="PAID"
          value={DataDashboard?.data?.transactions_paid || 0}
          icon={CheckCircle}
          color="blue"
        />
      </div>

      {/* Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Transaksi Terbaru
          </h2>
        </div>

        <div className="overflow-hidden bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
          {hasData ? (
            <table className="w-full text-left border-separate border-spacing-0 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b dark:border-gray-800"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="group hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center p-6 text-gray-500 dark:text-gray-400">
              Transaksi tidak ditemukan
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Badge component
function StatusBadge({ status }: { status: string }) {
  const config: any = {
    PAID: { color: 'bg-green-100 text-green-700', Icon: CheckCircle },
    FAILED: { color: 'bg-red-100 text-red-700', Icon: XCircle },
    PENDING: { color: 'bg-yellow-100 text-yellow-700', Icon: Clock },
  }
  const { color, Icon } = config[status] || config['PENDING']
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold ${color} gap-1`}
    >
      <Icon className="w-3 h-3" /> {status}
    </span>
  )
}

// Compact StatCard
function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    indigo: 'from-indigo-500/80 to-indigo-600/80',
    emerald: 'from-emerald-500/80 to-emerald-600/80',
    amber: 'from-amber-400/80 to-amber-500/80',
    rose: 'from-rose-500/80 to-rose-600/80',
    blue: 'from-blue-500/80 to-blue-600/80',
  }

  return (
    <div
      className={`relative p-3 rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-sm hover:scale-[1.02] transition-transform duration-200`}
    >
      <div className="flex justify-between items-start">
        <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider">{title}</p>
        <div className="p-1 bg-white/10 dark:bg-white/20 rounded-lg backdrop-blur-sm">
          <Icon className="w-3 h-3 text-white" />
        </div>
      </div>
      <p className="text-xl font-bold mt-2">{value}</p>

      {/* Decorative Circle */}
      <div className="absolute -right-3 -bottom-3 w-12 h-12 bg-white/10 dark:bg-white/5 rounded-full blur-2xl" />
    </div>
  )
}
