'use client'

import { CircleCheck, CircleDashed, KeyRound, RotateCw, TriangleAlert } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import { useAuthDialog } from '../../Auth/AuthDialogProvider'
import { GoogleButton } from '../../Auth/components/GoogleButton'
import { textLinkClass } from '../../Auth/components/styles'
import { useAuthMe } from '../../Auth/hooks/useAuthApi'
import { focusRing } from '../../Navigation/config'
import { Skeleton } from '../../ui/skeleton'
import { cn } from '../../ui/utils'

const badgeClass = 'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold'

function StatusPill({ active, children }: { active: boolean; children: ReactNode }) {
  const Icon = active ? CircleCheck : CircleDashed
  return (
    <span
      className={cn(
        badgeClass,
        active ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground',
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {children}
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
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted"
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
          <Skeleton className="size-10 shrink-0 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-4 w-48 max-w-full rounded-md" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </li>
      ))}
    </ul>
  )
}

/** Kartu "Metode masuk" di Dasbor: status password & Google dari GET /v1/auth/me. */
export default function SignInMethods({ token }: { token?: string | null }) {
  const t = useTranslations('SignInMethods')
  const { openAuthDialog } = useAuthDialog()
  const { data: me, isLoading, isError, isFetching, refetch } = useAuthMe(token)

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
        className="flex flex-col items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 sm:flex-row sm:items-center"
      >
        <TriangleAlert className="size-5 shrink-0 text-destructive" aria-hidden="true" />
        <p className="flex-1 text-sm text-foreground">{t('error')}</p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className={cn(
            'inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none',
            focusRing,
          )}
        >
          <RotateCw
            className={cn('size-4', isFetching && 'animate-spin motion-reduce:animate-none')}
            aria-hidden="true"
          />
          {t('retry')}
        </button>
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
    <section
      aria-labelledby="sign-in-methods-title"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-5 space-y-1">
        <h2 id="sign-in-methods-title" className="font-display text-lg font-bold text-foreground">
          {t('title')}
        </h2>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>
      {content}
    </section>
  )
}
