import { ReactNode } from 'react'

export default function LayoutTop({ children }: { children: ReactNode }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card bg-gradient-to-r from-brand/6 via-transparent to-brand-2/6 pt-[env(safe-area-inset-top,0px)] shadow-sm">
      <div className="mx-auto max-w-7xl px-3 min-[400px]:px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-14 min-w-0 items-center justify-between gap-2 py-1 sm:min-h-16 sm:gap-3 sm:py-0">
          {children}
        </div>
      </div>
    </nav>
  )
}
