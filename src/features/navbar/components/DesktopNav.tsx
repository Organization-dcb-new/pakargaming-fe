import GameSearch from './GameSearch'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import UserMenu from './UserMenu'

interface DesktopNavProps {
  user: any
  onLogin: () => void
}

/** Topbar desktop: tanpa menu link (Beranda via logo, Cek Transaksi via chip Home & footer). */
export default function DesktopNav({ user, onLogin }: DesktopNavProps) {
  return (
    <div className="hidden min-w-0 flex-1 items-center gap-4 lg:flex">
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <div className="w-52 xl:w-72">
          <GameSearch variant="desktop" />
        </div>
        <LanguageSwitcher />
        <ThemeToggle />
        <div aria-hidden="true" className="mx-1 h-6 w-px bg-border" />
        <UserMenu user={user} onLogin={onLogin} />
      </div>
    </div>
  )
}
