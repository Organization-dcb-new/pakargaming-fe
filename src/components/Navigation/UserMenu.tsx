'use client'

import { useState } from 'react'
import { ChevronDown, LayoutDashboard, LogIn, LogOut, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '../../i18n/routing'
import LogoutConfirmDialog from '../Auth/LogoutConfirmDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { PlayerAvatar } from '../ui/player-avatar'
import { focusRing, getAvatarSrc } from './config'

interface UserMenuProps {
  user: any
  /** Buka dialog Masuk/Daftar (Google tetap tersedia di dalam dialog). */
  onLogin: () => void
}

const menuItemClass =
  'cursor-pointer rounded-lg py-2.5 font-medium focus:bg-primary/10 focus:text-primary [&:focus_svg]:!text-primary'

export default function UserMenu({ user, onLogin }: UserMenuProps) {
  const t = useTranslations('Navigation')
  const [logoutOpen, setLogoutOpen] = useState(false)

  if (!user) {
    return (
      <button
        type="button"
        onClick={onLogin}
        aria-haspopup="dialog"
        className={`chamfer inline-flex h-9 shrink-0 cursor-pointer touch-manipulation items-center gap-2 whitespace-nowrap rounded-sm bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors duration-200 [--chamfer:8px] hover:bg-primary/85 active:scale-[0.98] motion-reduce:active:scale-100 ${focusRing}`}
      >
        <LogIn className="h-4 w-4 shrink-0" aria-hidden="true" />
        {t('login')}
      </button>
    )
  }

  const avatarSrc = getAvatarSrc(user)

  return (
    <>
      {/* modal={false}: mencegah body terkunci (pointer-events) saat dialog logout dibuka dari menu */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={t('accountMenu')}
            className={`group flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg p-0.5 pr-1.5 transition-colors duration-200 hover:bg-accent data-[state=open]:bg-accent ${focusRing}`}
          >
            <PlayerAvatar src={avatarSrc} size="sm" />
            <ChevronDown
              className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-64 overflow-hidden rounded-xl p-1.5">
          {/* Mini kartu pemain — sama dengan header Dasbor */}
          <DropdownMenuLabel className="relative -m-1.5 mb-1.5 flex items-center gap-3 overflow-hidden p-3 font-normal">
            <span aria-hidden="true" className="bg-stripes pointer-events-none absolute inset-0" />
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-gradient-brand" />
            <PlayerAvatar src={avatarSrc} size="md" className="relative" />
            <div className="relative min-w-0">
              <p className="truncate font-display text-sm font-bold text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem asChild className={menuItemClass}>
            <Link href="/dashboard">
              <LayoutDashboard />
              {t('dashboard')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={menuItemClass}>
            <Link href="/check-transaction">
              <Search />
              {t('checkTransaction')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer rounded-lg py-2.5"
            onSelect={() => setLogoutOpen(true)}
          >
            <LogOut />
            {t('logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </>
  )
}
