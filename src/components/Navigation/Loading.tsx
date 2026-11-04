import LayoutTop from './LayoutTop'

const bone = 'animate-pulse bg-muted motion-reduce:animate-none'

/** Skeleton meniru layout topbar final (lihat Navigation.tsx) supaya tidak ada layout shift. */
export default function LoadingNav() {
  return (
    <LayoutTop>
      {/* Mobile: tombol menu */}
      <div className={`h-10 w-10 shrink-0 rounded-lg lg:hidden ${bone}`} />

      {/* Brand */}
      <div className="flex shrink-0 items-center gap-2">
        <div className={`h-8 w-8 rounded-lg ${bone}`} />
        <div className={`h-4 w-24 rounded ${bone}`} />
      </div>

      {/* Desktop: menu */}
      <div className="hidden items-center gap-1 lg:flex">
        {[0, 1].map((i) => (
          <div key={i} className={`h-9 w-28 rounded-lg ${bone}`} />
        ))}
      </div>

      {/* Mobile: search */}
      <div className="flex min-w-0 flex-1 justify-end lg:hidden">
        <div className={`h-10 w-12 rounded-full sm:w-full sm:max-w-md ${bone}`} />
      </div>

      {/* Desktop: search, bahasa, tema, akun */}
      <div className="ml-auto hidden items-center gap-2 lg:flex">
        <div className={`h-10 w-52 rounded-full xl:w-72 ${bone}`} />
        <div className={`h-8 w-20 rounded-lg ${bone}`} />
        <div className={`h-9 w-9 rounded-md ${bone}`} />
        <div className="mx-1 h-6 w-px bg-border" />
        <div className={`h-9 w-9 rounded-full ${bone}`} />
      </div>
    </LayoutTop>
  )
}
