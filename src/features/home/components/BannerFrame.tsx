import { ReactNode } from 'react'

/** Bingkai banner — container & spacing diatur parent (HomePage.tsx). */
export default function BannerFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      {children}
    </div>
  )
}
