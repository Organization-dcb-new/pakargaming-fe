import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

type AuthUser = {
  name: string
  email: string
  picture?: string
}

export default function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authUser = getAuthUser()
    const authToken = Cookies.get('token')
    setUser(authUser)
    setToken(authToken || null)
    setLoading(false)
  }, [])

  return { user, token, loading }
}

export const logout = () => {
  Cookies.remove('token')
  Cookies.remove('user')

  window.location.href = '/'
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null

  const user = Cookies.get('user')
  if (!user) return null

  try {
    return JSON.parse(user)
  } catch {
    return null
  }
}
