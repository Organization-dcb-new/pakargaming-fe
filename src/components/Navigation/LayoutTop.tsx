import { ReactNode } from 'react'

export default function LayoutTop({ children }: { children: ReactNode }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-purple-500/30 bg-white/95 pt-[env(safe-area-inset-top,0px)] shadow-sm shadow-purple-900/5 backdrop-blur-md dark:border-purple-500/20 dark:bg-black/40 dark:shadow-none supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-black/30">
      <div className="mx-auto max-w-7xl px-3 min-[400px]:px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-14 min-w-0 items-center justify-between gap-2 py-1 sm:min-h-16 sm:gap-3 sm:py-0">
          {children}
        </div>
      </div>
    </nav>
  )
}
