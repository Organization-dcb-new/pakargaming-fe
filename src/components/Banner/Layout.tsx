import { ReactNode } from 'react'

export default function LayoutBanner({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      <div className="relative group overflow-hidden rounded-2xl shadow-2xl ring-1 ring-border/60">
        {children}
      </div>
    </div>
  )
}
