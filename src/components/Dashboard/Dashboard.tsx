'use client'
import useAuth from '../../hooks/useAuth'
import ClientLayout from '../ClientLayout'
import ProfileDashboard from './components/Profile'
import MyTransaction from './components/Transactions'
import { useGetTransactionByEmailDashboard } from './hooks/useGetTransaction'


export default function DashboardPages() {
  const { user, loading: authLoading } = useAuth() // Assuming useAuth provides a loading state
  const { data: DataDashboard, isLoading: dataLoading } = useGetTransactionByEmailDashboard(
    user?.email
  )

  // Combine both loading states
  const isCurrentlyLoading = authLoading || (user && dataLoading)

  // Only return null if auth is finished and there is definitely no user
  if (!authLoading && !user) return null

  return (
    <ClientLayout>
      {isCurrentlyLoading ? (
        <div className="flex flex-col justify-center items-center h-[60vh] w-full gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 animate-pulse text-sm">Sedang Memuat.....</p>
        </div>
      ) : (
        <>
          <ProfileDashboard />
          <MyTransaction DataDashboard={DataDashboard} isLoading={dataLoading} />
        </>
      )}
    </ClientLayout>
  )
}
