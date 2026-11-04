import { ReactNode } from 'react'

/** Grid checkout: kolom langkah (kiri) + ringkasan sticky (kanan, mulai lg). */
export default function LayoutData({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
      {children}
    </div>
  )
}
