'use client'

import useAuth from '../../../hooks/useAuth'
import { Skeleton } from '../../ui/skeleton'

export default function ProfileDashboard() {
  const { user } = useAuth()

  if (!user) {
    // Skeleton saat loading
    return (
      <div className="w-full">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl border border-purple-200/50 dark:border-purple-500/20 shadow-xl overflow-hidden p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-32 h-5 rounded-md" />
              <Skeleton className="w-40 h-4 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div
        className="bg-white/70 dark:bg-gray-800/70 
                   backdrop-blur-md 
                   rounded-2xl 
                   border border-purple-200/50 dark:border-purple-500/20 
                   shadow-xl overflow-hidden"
      >
        {/* Top Accent */}
        <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-700" />

        <div className="p-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4">
            <img
              src={user.picture}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover 
                         border-4 border-purple-200/50 dark:border-purple-500/30"
            />

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
