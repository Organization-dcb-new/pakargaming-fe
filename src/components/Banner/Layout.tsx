import { ReactNode } from 'react'

/** Bingkai banner — container & spacing diatur parent (Home.tsx). */
export default function LayoutBanner({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      {children}
    </div>
  )
}
