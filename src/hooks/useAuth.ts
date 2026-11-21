import { useEffect, useState } from 'react'
import { AUTH_CHANGE_EVENT, getAuthUser } from '@/lib/sessionClient'
import type { AuthUser } from '@/types/auth'

/**
 * JWT sesi ada di cookie HttpOnly yang hanya dibaca proxy (/api/proxy) — JavaScript tidak bisa melihatnya.
 * Status login di UI diambil dari cookie profil `user`, yang ditulis server bersamaan dan umurnya sama.
 */
export default function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sync = () => {
      setUser(getAuthUser())
      setLoading(false)
    }

    sync()
    window.addEventListener(AUTH_CHANGE_EVENT, sync)
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, sync)
  }, [])

  return { user, isLoggedIn: user !== null, loading }
}
