'use client'

import { CircleCheck, CircleDashed, KeyRound, TriangleAlert } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import { useAuthDialog } from '@/features/auth/components/AuthDialogProvider'
import { GoogleButton } from '@/features/auth/components/GoogleButton'
import { textLinkClass } from '@/features/auth/styles'
import { useAuthMe } from '@/features/auth/api/auth'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/cn'
import RetryButton from './RetryButton'
import { HudPanel } from '@/components/ui/hud-panel'

const badgeClass = 'inline-flex -skew-x-12 items-center rounded-sm px-2.5 py-0.5 text-xs font-bold'

function StatusPill({ active, children }: { active: boolean; children: ReactNode }) {
  const Icon = active ? CircleCheck : CircleDashed
  return (
    <span
      className={cn(
        badgeClass,
        active ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground',
      )}
    >
      <span className="inline-flex skew-x-12 items-center gap-1">
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {children}
      </span>
    </span>
  )
}

function MethodRow({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode
  title: string
  description: ReactNode
  children: ReactNode
}) {
  return (
    <li className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span
          aria-hidden="true"
          className="chamfer flex size-10 shrink-0 items-center justify-center bg-muted [--chamfer:8px]"
        >
          {icon}
        </span>
        <div className="min-w-0 space-y-0.5">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <div className="text-sm leading-relaxed text-muted-foreground">{description}</div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 pl-13 sm:pl-0">{children}</div>
    </li>
  )
}

function MethodsSkeleton() {
  return (
    <ul aria-hidden="true" className="divide-y divide-border">
      {[0, 1].map((row) => (
        <li key={row} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
          <Skeleton className="chamfer size-10 shrink-0 rounded-none [--chamfer:8px]" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-32 rounded-sm" />
            <Skeleton className="h-4 w-48 max-w-full rounded-sm" />
          </div>
          <Skeleton className="h-6 w-20 -skew-x-12 rounded-sm" />
        </li>
      ))}
    </ul>
  )
}

/** Kartu "Metode masuk" di Dasbor: status password & Google dari GET /v1/auth/me. */
export default function SignInMethods({ isLoggedIn }: { isLoggedIn: boolean }) {
  const t = useTranslations('SignInMethods')
  const { openAuthDialog } = useAuthDialog()
  const { data: me, isLoading, isError, isFetching, refetch } = useAuthMe(isLoggedIn)

  let content: ReactNode
  if (isLoading || (!me && !isError)) {
    content = (
      <div role="status" aria-busy="true">
        <span className="sr-only">{t('loading')}</span>
        <MethodsSkeleton />
      </div>
    )
  } else if (isError || !me) {
    content = (
      <div
        role="alert"
        className="flex flex-col items-start gap-3 rounded-sm border border-destructive/40 bg-destructive/10 p-4 sm:flex-row sm:items-center"
      >
        <TriangleAlert className="size-5 shrink-0 text-destructive" aria-hidden="true" />
        <p className="flex-1 text-sm text-foreground">{t('error')}</p>
        <RetryButton onClick={() => refetch()} isFetching={isFetching}>
          {t('retry')}
        </RetryButton>
      </div>
    )
  } else {
    content = (
      <ul className="divide-y divide-border">
        <MethodRow
          icon={<KeyRound className="size-5 text-foreground" />}
          title={t('passwordTitle')}
          description={
            me.has_password ? (
              me.email
            ) : (
              <>
                {t('passwordNotSetHint')}{' '}
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => openAuthDialog({ mode: 'forgot', email: me.email })}
                  className={textLinkClass}
                >
                  {t('setPassword')}
                </button>
              </>
            )
          }
        >
          <StatusPill active={me.has_password}>
            {me.has_password ? t('passwordActive') : t('passwordNotSet')}
          </StatusPill>
        </MethodRow>

        <MethodRow
          icon={<img src="/icons/google.svg" alt="" className="size-5" />}
          title={t('googleTitle')}
          description={me.google_linked ? t('googleLinkedHint') : t('googleNotLinkedHint')}
        >
          {me.google_linked ? (
            <StatusPill active>{t('googleLinked')}</StatusPill>
          ) : (
            <GoogleButton intent="link" className="h-9 w-auto px-3.5">
              {t('linkGoogle')}
            </GoogleButton>
          )}
        </MethodRow>
      </ul>
    )
  }

  return (
    <HudPanel as="section" aria-labelledby="sign-in-methods-title" accent={false} innerClassName="p-6">
      <div className="mb-5 space-y-1">
        <h2 id="sign-in-methods-title" className="font-display text-lg font-bold text-foreground flex items-center gap-2.5 before:h-5 before:w-1.5 before:shrink-0 before:-skew-x-12 before:bg-gradient-brand">
          {t('title')}
        </h2>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>
      {content}
    </HudPanel>
  )
}
