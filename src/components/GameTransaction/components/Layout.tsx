import { ReactNode } from 'react'

/** Container halaman top-up — lebar standar sama dengan navbar (rules §3). */
export default function LayoutGamesTransaction({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-10 pt-5 sm:px-6 lg:px-8">
      {children}
    </div>
  )
}
