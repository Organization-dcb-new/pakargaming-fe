'use client'

import useAuth from '@/hooks/useAuth'
import DashboardLayout from '@/features/dashboard/components/DashboardLayout'
import PlayerCard from '@/features/dashboard/components/PlayerCard'
import RecentTransactions from '@/features/dashboard/components/RecentTransactions'
import SignInMethods from '@/features/dashboard/components/SignInMethods'
import VerifyEmailBanner from '@/features/dashboard/components/VerifyEmailBanner'
import DeleteAccountSection from '@/features/dashboard/components/DeleteAccountSection'
import { useGetTransactionByEmailDashboard } from '@/api/useGetTransactionByEmailDashboard'
import { useAuthMe } from '@/features/auth/api/auth'
import { isEmailNotVerifiedError } from '@/features/auth/lib/authErrors'

export default function Dashboard() {
  const { user, isLoggedIn, loading: authLoading } = useAuth()
  const { data: me } = useAuthMe(isLoggedIn)
  // Email belum diverifikasi → backend menolak riwayat (403), jadi tidak usah diminta
  const emailUnverified = me?.email_verified === false
  const {
    data: DataDashboard,
    isLoading: dataLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useGetTransactionByEmailDashboard(isLoggedIn && !emailUnverified)

  // Only bail out once auth has resolved and there is definitely no user
  if (!authLoading && !user) return null

  // Riwayat dicocokkan lewat email: terkunci sampai email diverifikasi (status /me, atau 403 dari backend)
  const locked = emailUnverified || isEmailNotVerifiedError(error)
  const isLoading = !locked && Boolean(authLoading || dataLoading)
  const loadFailed = isError && !locked
  const stats = locked ? undefined : DataDashboard?.data
  const verifyEmail = me?.email ?? user?.email
  const onRetry = () => {
    refetch()
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {locked && verifyEmail && <VerifyEmailBanner email={verifyEmail} />}
        <PlayerCard
          user={user}
          stats={stats}
          isLoading={isLoading}
          isError={loadFailed}
          isFetching={isFetching}
          locked={locked}
          onRetry={onRetry}
        />
        <RecentTransactions
          transactions={stats?.transaction_detail ?? []}
          isLoading={isLoading}
          isError={loadFailed}
          isFetching={isFetching}
          locked={locked}
          onRetry={onRetry}
        />
        <SignInMethods isLoggedIn={isLoggedIn} />
        <DeleteAccountSection me={me} />
      </div>
    </DashboardLayout>
  )
}
