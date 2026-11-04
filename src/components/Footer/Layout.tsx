import { ReactNode } from 'react'

export default function LayoutFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="relative mt-16 bg-card/60">
      {/* Garis atas gradient logo — sepasang dengan garis bawah navbar */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-brand opacity-60" />
      <div className="mx-auto w-full max-w-7xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-12 sm:px-6 lg:px-8 lg:pt-16">
        {children}
      </div>
    </footer>
  )
}
