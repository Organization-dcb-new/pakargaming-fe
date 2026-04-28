export default function LoadingNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-purple-500/20 bg-white/95 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md dark:bg-black/40 supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-black/30">
      <div className="mx-auto max-w-7xl px-3 min-[400px]:px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-14 min-w-0 animate-pulse items-center justify-between gap-2 py-1 sm:min-h-16 sm:py-0">
          {/* Logo */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="h-7 w-7 rounded-full bg-gray-200 sm:h-8 sm:w-8 dark:bg-white/10" />
            <div className="hidden h-4 w-20 rounded bg-gray-200 min-[400px]:block sm:h-5 sm:w-28 dark:bg-white/10" />
          </div>

          {/* Desktop tengah */}
          <div className="hidden items-center gap-6 md:flex">
            <div className="h-4 w-12 rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-4 w-14 rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-4 w-20 rounded bg-gray-200 dark:bg-white/10" />
          </div>

          {/* Mobile: search mini + menu */}
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 md:hidden">
            <div className="h-10 w-12 shrink-0 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="h-11 w-11 shrink-0 rounded-xl bg-gray-200 dark:bg-white/10" />
          </div>

          {/* Desktop kanan */}
          <div className="hidden items-center gap-2 sm:gap-4 md:flex">
            <div className="h-7 w-7 rounded-full bg-gray-200 sm:h-8 sm:w-8 dark:bg-white/10" />
            <div className="hidden h-8 w-20 rounded-full bg-gray-200 sm:block sm:h-9 sm:w-24 dark:bg-white/10" />
          </div>
        </div>
      </div>
    </nav>
  )
}
