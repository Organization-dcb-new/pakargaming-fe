'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import UseLoginGoogleOauth from '../hooks/useLogin'
import DesktopNavigation from './Navigation/Desktop'
import LoadingNav from './Navigation/Loading'
import MobileNavigation from './Navigation/Mobile'
import LogoNavigation from './Navigation/Logo'
import useAuth from '../hooks/useAuth'
import MobileBottomNav from './Navigation/MobileBottom'
import LayoutTop from './Navigation/LayoutTop'
import LayoutBottom from './Navigation/LayoutBottom'

export function Navigation() {
  const [openProfile, setOpenProfile] = useState(false)

  const t = useTranslations('Navigation')
  const { loginWithGoogle } = UseLoginGoogleOauth()
  const { user, loading } = useAuth()

  useEffect(() => {
    const handler = () => setOpenProfile(false)
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [])

  const navLinks = [
    // { path: '/en/my-transaction', label: t('transaction'), auth: true },
    // { path: '/en/check-transaction', label: 'Cek Transaksi', auth: false },
  ]
  const visibleNavLinks = navLinks.filter((link) => !link.auth || user)

  if (loading) {
    return <LoadingNav />
  }

  return (
    <>
      <LayoutTop>
        <LogoNavigation />
        <DesktopNavigation
          visibleNavLinks={visibleNavLinks}
          loginWithGoogle={loginWithGoogle}
          user={user}
          openProfile={openProfile}
          setOpenProfile={setOpenProfile}
        />
        <MobileNavigation
          loginWithGoogle={loginWithGoogle}
          openProfile={openProfile}
          user={user}
          setOpenProfile={setOpenProfile}
        />
      </LayoutTop>

      <LayoutBottom>
        <MobileBottomNav visibleNavLinks={visibleNavLinks} />
      </LayoutBottom>
    </>
  )
}
