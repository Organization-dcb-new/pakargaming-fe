'use client'

import useAuth from '../../hooks/useAuth'
import ClientLayout from '../ClientLayout'
import PlayerCard from './components/PlayerCard'
import RecentTransactions from './components/RecentTransactions'
import SignInMethods from './components/SignInMethods'
import { useGetTransactionByEmailDashboard } from './hooks/useGetTransaction'

export default function DashboardPages() {
  const { user, token, loading: authLoading } = useAuth()
  const {
    data: DataDashboard,
    isLoading: dataLoading,
    isError,
    isFetching,
    refetch,
  } = useGetTransactionByEmailDashboard(token)

  // Only bail out once auth has resolved and there is definitely no user
  if (!authLoading && !user) return null

  const isLoading = Boolean(authLoading || dataLoading)
  const stats = DataDashboard?.data
  const onRetry = () => {
    refetch()
  }

  return (
    <ClientLayout>
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
        <SignInMethods token={token} />
      </div>
    </ClientLayout>
  )
}
