'use client'

import useAuth from '../../hooks/useAuth'
import ClientLayout from '../ClientLayout'
import ProfileDashboard from './components/Profile'
import MyTransaction from './components/Transactions'
import { useGetTransactionByEmailDashboard } from './hooks/useGetTransaction'

export default function DashboardPages() {
  const { user, token, loading: authLoading } = useAuth()
  const { data: DataDashboard, isLoading: dataLoading } =
    useGetTransactionByEmailDashboard(token)

  // Only bail out once auth has resolved and there is definitely no user
  if (!authLoading && !user) return null

  return (
    <ClientLayout>
      <div className="space-y-6">
        <ProfileDashboard />
        <MyTransaction
          DataDashboard={DataDashboard}
          isLoading={Boolean(authLoading || dataLoading)}
        />
      </div>
    </ClientLayout>
  )
}
