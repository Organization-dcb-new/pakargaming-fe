'use client'

import { useState } from 'react'
import UseLoginGoogleOauth from '@/features/auth/hooks/useLoginGoogleOauth'
import useAuth from '@/hooks/useAuth'
import { useAuthDialog } from '@/features/auth/components/AuthDialogProvider'
import DesktopNav from '@/features/navbar/components/DesktopNav'
import GameSearch from '@/features/navbar/components/GameSearch'
import NavbarSkeleton from '@/features/navbar/components/NavbarSkeleton'
import MobileNav from '@/features/navbar/components/MobileNav'
import MobileSearch from '@/features/navbar/components/MobileSearch'
import UserMenu from '@/features/navbar/components/UserMenu'
import Logo from '@/components/Logo'
import NavbarFrame from '@/features/navbar/components/NavbarFrame'

/**
 * Desktop (≥ lg): logo · search di tengah (⌘K) · Cek Transaksi · pengaturan · akun.
 * Mobile: logo · ikon search (melebar, logo menyusut) · akun · ☰ (panel dari kanan).
 */
export function Navbar() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  // Selalu ter-mount: memproses redirect Google (?auth_code, ?auth_error, ?google_link)
  UseLoginGoogleOauth()
  const { user, loading } = useAuth()
  const { openAuthDialog } = useAuthDialog()

  if (loading) {
    return <NavbarSkeleton />
  }

  const openLogin = () => openAuthDialog({ mode: 'login' })

  return (
    <NavbarFrame>
      <Logo collapsedOnMobile={mobileSearchOpen} />

      <div className="hidden min-w-0 flex-1 justify-center lg:flex">
        <div className="w-full max-w-xl">
          <GameSearch variant="desktop" />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-1 lg:flex-none">
        <MobileSearch open={mobileSearchOpen} onOpenChange={setMobileSearchOpen} />
        <DesktopNav />
        <UserMenu user={user} onLogin={openLogin} />
        <MobileNav user={user} onLogin={openLogin} />
      </div>
    </NavbarFrame>
  )
}
