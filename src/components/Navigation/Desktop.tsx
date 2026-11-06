import SearchComponent from './Search'
import { ThemeToggle } from '../ThemeToggle'
import { LanguageSwitcher } from '../LanguageSwitcher'
import UserMenu from './UserMenu'

interface DesktopNavProps {
  user: any
  onLogin: () => void
}

/** Topbar desktop: tanpa menu link (Beranda via logo, Cek Transaksi via chip Home & footer). */
export default function DesktopNavigation({ user, onLogin }: DesktopNavProps) {
  return (
    <div className="hidden min-w-0 flex-1 items-center gap-4 lg:flex">
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <div className="w-52 xl:w-72">
          <SearchComponent variant="desktop" />
        </div>
        <LanguageSwitcher />
        <ThemeToggle />
        <div aria-hidden="true" className="mx-1 h-6 w-px bg-border" />
        <UserMenu user={user} onLogin={onLogin} />
      </div>
    </div>
  )
}
