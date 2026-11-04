import { ReactNode } from 'react'

export default function LayoutTop({ children }: { children: ReactNode }) {
  return (
    <header className="sticky top-0 z-50 bg-background/90 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tinggi wajib h-14 / md:h-16: sticky nav di Home (top-14 md:top-16) bergantung padanya */}
        <div className="flex h-14 min-w-0 items-center gap-2 sm:gap-3 md:h-16 lg:gap-4">
          {children}
        </div>
      </div>
      {/* Garis bawah gradient logo (ungu → cyan) — pengganti border polos */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-brand opacity-60" />
    </header>
  )
}
