'use client'

import useAuth from '@/hooks/useAuth'
import DashboardLayout from '@/features/dashboard/components/DashboardLayout'
import PlayerCard from '@/features/dashboard/components/PlayerCard'
import RecentTransactions from '@/features/dashboard/components/RecentTransactions'
import SignInMethods from '@/features/dashboard/components/SignInMethods'
import { useGetTransactionByEmailDashboard } from '@/api/useGetTransactionByEmailDashboard'

export default function Dashboard() {
  const { user, isLoggedIn, loading: authLoading } = useAuth()
  const {
    data: DataDashboard,
    isLoading: dataLoading,
    isError,
    isFetching,
    refetch,
  } = useGetTransactionByEmailDashboard(isLoggedIn)

  // Only bail out once auth has resolved and there is definitely no user
  if (!authLoading && !user) return null

  const isLoading = Boolean(authLoading || dataLoading)
  const stats = DataDashboard?.data
  const onRetry = () => {
    refetch()
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PlayerCard
          user={user}
          stats={stats}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          onRetry={onRetry}
        />
        <RecentTransactions
          transactions={stats?.transaction_detail ?? []}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          onRetry={onRetry}
        />
        <SignInMethods isLoggedIn={isLoggedIn} />
      </div>
    </DashboardLayout>
  )
}
