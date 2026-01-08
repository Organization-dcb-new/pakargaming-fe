'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Cookies from 'js-cookie'

export default function useLoginGoogleOauth() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const loginWithGoogle = () => {
    const apiUrl = 'http://localhost:4444/v1'
    window.location.href = `${apiUrl}/auth/google`
  }

  useEffect(() => {
    const token = searchParams.get('token')
    const user = searchParams.get('user')

    if (!token || !user) return

    Cookies.set('token', token)
    Cookies.set('user', decodeURIComponent(user))

    router.replace('/')
  }, [searchParams, router])

  return { loginWithGoogle }
}
