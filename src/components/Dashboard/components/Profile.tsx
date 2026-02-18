'use client'

import useAuth from "../../../hooks/useAuth"


export default function ProfileDashboard() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="w-full max-w-md">
      <div
        className="bg-white dark:bg-zinc-900 
                      rounded-2xl 
                      border border-purple-200 dark:border-purple-500/20 
                      shadow-xl 
                      overflow-hidden"
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
                         border-4 border-purple-200 
                         dark:border-purple-500/30"
            />

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-purple-200 dark:bg-purple-500/20" />

          {/* Info Section */}
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Status</span>
              <span className="text-purple-600 dark:text-purple-400 font-medium">Active</span>
            </div>

            <div className="flex justify-between">
              <span>Role</span>
              <span>User</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
