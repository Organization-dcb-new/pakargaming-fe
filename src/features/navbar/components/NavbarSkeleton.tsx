import NavbarFrame from './NavbarFrame'

const bone = 'animate-pulse bg-muted motion-reduce:animate-none'

/** Skeleton meniru layout navbar final (lihat Navbar.tsx) supaya tidak ada layout shift. */
export default function NavbarSkeleton() {
  return (
    <NavbarFrame>
      {/* Brand */}
      <div className="flex shrink-0 items-center gap-2.5">
        <div className={`h-8 w-8 rounded-lg ${bone}`} />
        <div className={`h-5 w-36 rounded max-[399px]:hidden ${bone}`} />
      </div>

      {/* Desktop: search di tengah */}
      <div className="hidden min-w-0 flex-1 justify-center lg:flex">
        <div className={`h-10 w-full max-w-xl rounded-lg ${bone}`} />
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-1 lg:flex-none">
        {/* Mobile: ikon/bar search */}
        <div className={`h-10 w-12 rounded-lg sm:w-full sm:max-w-md lg:hidden ${bone}`} />
        {/* Desktop: Cek Transaksi + pengaturan */}
        <div className="hidden items-center gap-1 lg:flex">
          <div className={`h-10 w-28 rounded-lg ${bone}`} />
          <div className={`h-10 w-16 rounded-lg ${bone}`} />
          <div className="mx-1.5 h-6 w-px bg-border" />
        </div>
        {/* Akun */}
        <div className={`h-9 w-16 rounded-sm lg:h-10 lg:w-20 ${bone}`} />
        {/* Mobile: menu */}
        <div className={`h-10 w-10 rounded-lg lg:hidden ${bone}`} />
      </div>
    </NavbarFrame>
  )
}
