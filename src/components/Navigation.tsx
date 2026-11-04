'use client'
import { useState } from 'react'

import UseLoginGoogleOauth from '../hooks/useLogin'
import useAuth from '../hooks/useAuth'
import DesktopNavigation from './Navigation/Desktop'
import LoadingNav from './Navigation/Loading'
import MobileNavigation from './Navigation/Mobile'
import MobileSearch from './Navigation/MobileSearch'
import LogoNavigation from './Navigation/Logo'
import LayoutTop from './Navigation/LayoutTop'

export function Navigation() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const { loginWithGoogle } = UseLoginGoogleOauth()
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingNav />
  }

  return (
    <LayoutTop>
      <MobileNavigation user={user} loginWithGoogle={loginWithGoogle} />
      <LogoNavigation collapsedOnMobile={mobileSearchOpen} />
      <DesktopNavigation user={user} loginWithGoogle={loginWithGoogle} />
      <MobileSearch open={mobileSearchOpen} onOpenChange={setMobileSearchOpen} />
    </LayoutTop>
  )
}
