'use client'

import { useTranslations } from 'next-intl'
import useAuth from '../../../hooks/useAuth'
import { getAvatarSrc } from '../../Navigation/config'
import { Skeleton } from '../../ui/skeleton'

export default function ProfileDashboard() {
  const { user } = useAuth()
  const t = useTranslations('Dashboard')

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-4 w-52 rounded-md" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/10 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Akun email+password tidak punya foto: /avatar.png tidak ada, pakai avatar inisial seperti navbar */}
        <img
          src={getAvatarSrc(user)}
          alt=""
          aria-hidden="true"
          className="h-16 w-16 shrink-0 rounded-full border-2 border-brand/30 object-cover"
        />

        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{t('welcome')},</p>
          <h1 className="truncate text-xl font-bold text-foreground sm:text-2xl">{user.name}</h1>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
    </div>
  )
}
