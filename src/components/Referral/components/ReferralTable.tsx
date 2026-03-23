'use client'

import React from 'react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import { ReferralUser, ReferralStatus } from '../types/referral'

interface ReferralTableProps {
  users: ReferralUser[]
}

function StatusBadge({ status }: { status: ReferralStatus }) {
  const config: Record<ReferralStatus, { color: string; label: string; Icon: any }> = {
    active: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Aktif', Icon: CheckCircle },
    pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Menunggu', Icon: Clock },
    inactive: { color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400', label: 'Tidak Aktif', Icon: XCircle },
  }
  const { color, label, Icon } = config[status]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold ${color} gap-1`}>
      <Icon className="w-3 h-3" /> {label}
    </span>
  )
}

const formatIDR = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)

export default function ReferralTable({ users }: ReferralTableProps) {
  const columns = React.useMemo<ColumnDef<ReferralUser>[]>(
    () => [
      {
        accessorKey: 'username',
        header: 'Username',
        cell: ({ getValue }) => (
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'joinedAt',
        header: 'Bergabung',
        cell: ({ getValue }) => {
          const dateStr = getValue() as string
          return (
            <span className="text-gray-600 dark:text-gray-400">
              {dateStr.split('T')[0]}
            </span>
          )
        },
      },
      {
        accessorKey: 'totalTransactions',
        header: 'Total Transaksi',
        cell: ({ getValue }) => (
          <span className="text-gray-700 dark:text-gray-300">{getValue() as number}x</span>
        ),
      },
      {
        accessorKey: 'totalSpent',
        header: 'Total Belanja',
        cell: ({ getValue }) => (
          <span className="text-gray-700 dark:text-gray-300">{formatIDR(getValue() as number)}</span>
        ),
      },
      {
        accessorKey: 'bonusEarned',
        header: 'Bonus Kamu',
        cell: ({ getValue }) => (
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            {formatIDR(getValue() as number)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => <StatusBadge status={getValue() as ReferralStatus} />,
      },
    ],
    []
  )

  const table = useReactTable({ data: users, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Daftar Referral
      </h2>
      <div className="overflow-hidden bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-x-auto">
        {users.length === 0 ? (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400">
            Belum ada referral
          </div>
        ) : (
          <table className="w-full text-left border-separate border-spacing-0 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b dark:border-gray-800 whitespace-nowrap"
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
                  className="group hover:bg-purple-50/30 dark:hover:bg-purple-900/10 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 whitespace-nowrap"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
