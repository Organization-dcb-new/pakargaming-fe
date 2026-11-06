'use client'

import { CircleCheck, House, KeyRound, LayoutDashboard, LogIn, TriangleAlert } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { Link } from '../../i18n/routing'
import { useAuthDialog } from '../Auth/AuthDialogProvider'
import { primaryButtonClass, secondaryButtonClass } from '../Auth/components/styles'
import ResetPasswordForm from './components/ResetPasswordForm'
import ResultPanel from './components/ResultPanel'

/**
 * Halaman tujuan link email "atur password" (`/auth/reset-password?token=...`).
 * Dipakai juga oleh akun Google yang ingin menambah password.
 */
export default function ResetPassword({ token }: { token: string | null }) {
  const t = useTranslations('ResetPassword')
  const { user } = useAuth()
  const { openAuthDialog } = useAuthDialog()
  const [done, setDone] = useState(false)

  const requestNewLink = () => openAuthDialog({ mode: 'forgot', email: user?.email })

  const homeLink = (
    <Link href="/" className={secondaryButtonClass}>
      <House className="size-4" aria-hidden="true" />
      {t('home')}
    </Link>
  )

  let content
  if (!token) {
    content = (
      <ResultPanel
        icon={TriangleAlert}
        tone="destructive"
        title={t('missingTitle')}
        description={t('missingBody')}
      >
        <div className="flex flex-col gap-3">
          <button type="button" aria-haspopup="dialog" onClick={requestNewLink} className={primaryButtonClass}>
            {t('requestNewLink')}
          </button>
          {homeLink}
        </div>
      </ResultPanel>
    )
  } else if (done) {
    content = (
      <div role="status">
        <ResultPanel
          icon={CircleCheck}
          tone="success"
          title={t('successTitle')}
          description={t('successBody')}
          focusOnMount
        >
          <div className="flex flex-col gap-3">
            {user ? (
              <Link href="/dashboard" className={primaryButtonClass}>
                <LayoutDashboard className="size-4" aria-hidden="true" />
                {t('dashboard')}
              </Link>
            ) : (
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => openAuthDialog({ mode: 'login' })}
                className={primaryButtonClass}
              >
                <LogIn className="size-4" aria-hidden="true" />
                {t('login')}
              </button>
            )}
            {homeLink}
          </div>
        </ResultPanel>
      </div>
    )
  } else {
    content = (
      <ResultPanel icon={KeyRound} tone="primary" title={t('title')} description={t('description')}>
        <ResetPasswordForm
          token={token}
          onSuccess={() => setDone(true)}
          onRequestNewLink={requestNewLink}
        />
      </ResultPanel>
    )
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl justify-center px-4 py-12 sm:px-6 md:py-20 lg:px-8">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
        {content}
      </div>
    </section>
  )
}
