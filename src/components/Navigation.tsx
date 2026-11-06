'use client'
import { useState } from 'react'

import UseLoginGoogleOauth from '../hooks/useLogin'
import useAuth from '../hooks/useAuth'
import { useAuthDialog } from './Auth/AuthDialogProvider'
import DesktopNavigation from './Navigation/Desktop'
import LoadingNav from './Navigation/Loading'
import MobileNavigation from './Navigation/Mobile'
import MobileSearch from './Navigation/MobileSearch'
import LogoNavigation from './Navigation/Logo'
import LayoutTop from './Navigation/LayoutTop'

export function Navigation() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  // Selalu ter-mount: memproses redirect Google (?token, ?auth_error, ?google_link)
  UseLoginGoogleOauth()
  const { user, loading } = useAuth()
  const { openAuthDialog } = useAuthDialog()

  if (loading) {
    return <LoadingNav />
  }

  const openLogin = () => openAuthDialog({ mode: 'login' })

  return (
    <LayoutTop>
      <MobileNavigation user={user} onLogin={openLogin} />
      <LogoNavigation collapsedOnMobile={mobileSearchOpen} />
      <DesktopNavigation user={user} onLogin={openLogin} />
      <MobileSearch open={mobileSearchOpen} onOpenChange={setMobileSearchOpen} />
    </LayoutTop>
  )
}
