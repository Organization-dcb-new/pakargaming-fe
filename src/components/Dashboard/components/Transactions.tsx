'use client'

import React from 'react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import {
  CheckCircle,
  XCircle,
  Clock,
  Wallet,
  Activity,
  AlertCircle,
  Receipt,
  type LucideIcon,
} from 'lucide-react'
import { GetTransactionResponsesDashboard } from '../hooks/useGetTransaction'
import { PaymentResponseDetail } from '../types/transactions'
import { useRouter } from '../../../i18n/routing'
import { useTranslations } from 'next-intl'
import { Skeleton } from '../../ui/skeleton'

interface MyTransactionProps {
  DataDashboard?: GetTransactionResponsesDashboard
  isLoading: boolean
}

const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export default function MyTransaction({ DataDashboard, isLoading }: MyTransactionProps) {
  const router = useRouter()
  const t = useTranslations('Dashboard')

  const stats = DataDashboard?.data
  const transactions = stats?.transaction_detail ?? []
  const isEmpty = !isLoading && transactions.length === 0

  const rows: PaymentResponseDetail[] = React.useMemo(
    () =>
      isLoading
        ? Array.from({ length: 5 }).map((_, i) => ({ id: `skeleton-${i}` }) as PaymentResponseDetail)
        : transactions,
    [isLoading, transactions]
  )

  const columns = React.useMemo<ColumnDef<PaymentResponseDetail>[]>(
    () => [
      {
        accessorKey: 'payment_number',
        header: t('paymentNumber'),
        cell: ({ row, getValue }) =>
          isLoading ? (
            <Skeleton className="h-4 w-28 rounded" />
          ) : (
            <button
              type="button"
              onClick={() => router.push(`/detail-trx/${row.original.id}`)}
              className="font-medium text-brand transition-colors hover:underline"
            >
              {getValue() as string}
            </button>
          ),
      },
      {
        accessorKey: 'created_at',
        header: t('date'),
        cell: ({ getValue }) =>
          isLoading ? (
            <Skeleton className="h-4 w-32 rounded" />
          ) : (
            <span className="text-muted-foreground">
              {((getValue() as string) || '').split('.')[0].replace('T', ' ')}
            </span>
          ),
      },
      {
        accessorKey: 'amount',
        header: t('amount'),
        cell: ({ getValue }) =>
          isLoading ? (
            <Skeleton className="h-4 w-20 rounded" />
          ) : (
            <span className="font-medium text-foreground">{currency.format(getValue() as number)}</span>
          ),
      },
      {
        accessorKey: 'status',
        header: t('status'),
        cell: ({ getValue }) =>
          isLoading ? (
            <Skeleton className="h-5 w-16 rounded-md" />
          ) : (
            <StatusBadge status={getValue() as string} />
          ),
      },
    ],
    [isLoading, router, t]
  )

  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">{t('summaryTitle')}</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            title={t('statTotalTransactions')}
            value={stats?.total_transactions ?? 0}
            icon={Activity}
            color="brand"
            loading={isLoading}
          />
          <StatCard
            title={t('statTotalAmount')}
            value={currency.format(stats?.total_amount ?? 0)}
            icon={Wallet}
            color="emerald"
            loading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title={t('statPaid')}
            value={stats?.transactions_paid ?? 0}
            icon={CheckCircle}
            color="blue"
            loading={isLoading}
          />
          <StatCard
            title={t('statPending')}
            value={stats?.transactions_pending ?? 0}
            icon={Clock}
            color="amber"
            loading={isLoading}
          />
          <StatCard
            title={t('statFailed')}
            value={stats?.transactions_failed ?? 0}
            icon={AlertCircle}
            color="rose"
            loading={isLoading}
          />
        </div>
      </section>

      {/* Recent transactions */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">{t('recentTitle')}</h2>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Receipt className="h-6 w-6" />
              </span>
              <p className="text-sm text-muted-foreground">{t('emptyState')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0 text-sm">
                <thead className="bg-muted/50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="whitespace-nowrap border-b border-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-muted/40">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="whitespace-nowrap border-b border-border px-4 py-3"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

type StatColor = 'brand' | 'emerald' | 'amber' | 'rose' | 'blue'

const STAT_CHIP: Record<StatColor, string> = {
  brand: 'bg-brand/10 text-brand',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  loading,
}: {
  title: string
  value: React.ReactNode
  icon: LucideIcon
  color: StatColor
  loading?: boolean
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-brand/30">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${STAT_CHIP[color]}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
          {loading ? (
            <Skeleton className="mt-1.5 h-6 w-20 rounded-md" />
          ) : (
            <p className="mt-0.5 truncate text-xl font-bold text-foreground">{value}</p>
          )}
        </div>
      </div>
    </div>
  )
}

const STATUS_STYLES = {
  paid: {
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    Icon: CheckCircle,
  },
  failed: {
    className: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
    Icon: XCircle,
  },
  pending: {
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    Icon: Clock,
  },
} as const

function normalizeStatus(status: string): keyof typeof STATUS_STYLES {
  const s = (status || '').toUpperCase()
  if (s === 'PAID' || s === 'SUCCESS') return 'paid'
  if (s === 'FAILED') return 'failed'
  return 'pending'
}

function StatusBadge({ status }: { status: string }) {
  const t = useTranslations('Dashboard')
  const key = normalizeStatus(status)
  const { className, Icon } = STATUS_STYLES[key]
  const label =
    key === 'paid' ? t('statusLabelPaid') : key === 'failed' ? t('statusLabelFailed') : t('statusLabelPending')

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${className}`}
    >
      <Icon className="h-3 w-3" /> {label}
    </span>
  )
}
