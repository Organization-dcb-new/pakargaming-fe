'use client'

import { useState } from 'react'
import { ChevronDown, LayoutDashboard, LogOut } from 'lucide-react'
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
import { focusRing, getAvatarSrc } from './config'

interface UserMenuProps {
  user: any
  loginWithGoogle: () => void
}

export default function UserMenu({ user, loginWithGoogle }: UserMenuProps) {
  const t = useTranslations('Navigation')
  const [logoutOpen, setLogoutOpen] = useState(false)

  if (!user) {
    return (
      <button
        type="button"
        onClick={loginWithGoogle}
        className={`chamfer inline-flex h-9 shrink-0 cursor-pointer touch-manipulation items-center gap-2 whitespace-nowrap rounded-sm bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors duration-200 [--chamfer:8px] hover:bg-primary/85 active:scale-[0.98] motion-reduce:active:scale-100 ${focusRing}`}
      >
        <img
          src="/icons/google.svg"
          alt=""
          aria-hidden="true"
          className="h-5 w-5 rounded-full bg-white p-0.5"
        />
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
            className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full p-0.5 pr-2 transition-colors duration-200 hover:bg-accent data-[state=open]:bg-accent ${focusRing}`}
          >
            <img
              src={avatarSrc}
              alt=""
              aria-hidden="true"
              className="h-8 w-8 rounded-full border border-border bg-card object-cover"
            />
            <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-60 rounded-xl p-1.5">
          <DropdownMenuLabel className="flex items-center gap-3 font-normal">
            <img
              src={avatarSrc}
              alt=""
              aria-hidden="true"
              className="h-9 w-9 shrink-0 rounded-full border border-border bg-card object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer py-2">
            <Link href="/dashboard">
              <LayoutDashboard />
              {t('dashboard')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer py-2"
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
