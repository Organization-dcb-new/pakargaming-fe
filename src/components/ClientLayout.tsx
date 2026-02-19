'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '../hooks/useAuth'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const menus = [
    { name: 'Dashboard', href: '/en/dashboard' },
    // { name: 'Transaksi', href: '/en/transaksi' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/50 dark:via-purple-900/50 to-background flex justify-center">
      {/* Wrapper supaya content nggak terlalu lebar */}
      <div className="w-full max-w-6xl flex gap-6">
        {/* Sidebar */}
        <aside className="w-52 py-10 px-4 flex flex-col  h-[calc(100vh-2.5rem)]">
          {/* Menu */}
          <div className="flex flex-col space-y-2 mb-3">
            {menus.map((menu) => {
              const isActive = pathname === menu.href
              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition
                    ${
                      isActive
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {menu.name}
                </Link>
              )
            })}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="block  cursor-pointer text-start w-full px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
          >
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-10 px-6">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-sm p-8 min-h-[80vh]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
