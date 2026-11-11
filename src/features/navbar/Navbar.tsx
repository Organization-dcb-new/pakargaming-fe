'use client'
import { useState } from 'react'

import UseLoginGoogleOauth from '@/features/auth/hooks/useLoginGoogleOauth'
import useAuth from '@/hooks/useAuth'
import { useAuthDialog } from '@/features/auth/components/AuthDialogProvider'
import DesktopNav from '@/features/navbar/components/DesktopNav'
import NavbarSkeleton from '@/features/navbar/components/NavbarSkeleton'
import MobileNav from '@/features/navbar/components/MobileNav'
import MobileSearch from '@/features/navbar/components/MobileSearch'
import Logo from '@/components/Logo'
import NavbarFrame from '@/features/navbar/components/NavbarFrame'

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
      <MobileNav user={user} onLogin={openLogin} />
      <Logo collapsedOnMobile={mobileSearchOpen} />
      <DesktopNav user={user} onLogin={openLogin} />
      <MobileSearch open={mobileSearchOpen} onOpenChange={setMobileSearchOpen} />
    </NavbarFrame>
  )
}
