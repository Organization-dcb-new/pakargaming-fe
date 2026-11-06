'use client'

import { useIsMutating } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useCallback, type MutableRefObject } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import ForgotPasswordForm from './components/ForgotPasswordForm'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import { AUTH_DIALOG_MUTATION_KEY } from './hooks/useAuthApi'
import type { AuthDialogMode, AuthDialogNotice } from './types'

interface AuthDialogProps {
  open: boolean
  mode: AuthDialogMode
  notice?: AuthDialogNotice
  /** Email terakhir yang diketik — dibaca saat form (re)mount supaya ikut terbawa antar mode. */
  emailDraft: MutableRefObject<string>
  onOpenChange: (open: boolean) => void
  onModeChange: (mode: AuthDialogMode) => void
}

const tabTriggerClass =
  'h-full cursor-pointer rounded-md border-0 font-semibold text-muted-foreground transition-colors duration-200 hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm dark:text-muted-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground motion-reduce:transition-none'

/** Dialog Masuk / Daftar / Lupa password — satu instance, dibuka lewat useAuthDialog(). */
export default function AuthDialog({
  open,
  mode,
  notice,
  emailDraft,
  onOpenChange,
  onModeChange,
}: AuthDialogProps) {
  const t = useTranslations('AuthDialog')
  // Jangan bisa ditutup (Esc / klik luar / X) saat request auth sedang berjalan
  const busy = useIsMutating({ mutationKey: AUTH_DIALOG_MUTATION_KEY }) > 0

  const close = useCallback(() => onOpenChange(false), [onOpenChange])
  const setEmailDraft = useCallback(
    (email: string) => {
      emailDraft.current = email
    },
    [emailDraft],
  )

  const heading = {
    login: { title: t('titleLogin'), description: t('descLogin') },
    register: { title: t('titleRegister'), description: t('descRegister') },
    forgot: { title: t('titleForgot'), description: t('descForgot') },
  }[mode]

  const formProps = {
    defaultEmail: emailDraft.current,
    onEmailChange: setEmailDraft,
    onSwitchMode: onModeChange,
    onDone: close,
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!busy) onOpenChange(next)
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-5 overflow-y-auto overscroll-contain rounded-2xl border-border bg-card p-6 sm:max-w-md">
        <DialogHeader className="pr-6">
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            {heading.title}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            {heading.description}
          </DialogDescription>
        </DialogHeader>

        {mode === 'forgot' ? (
          <ForgotPasswordForm {...formProps} />
        ) : (
          <Tabs
            value={mode}
            onValueChange={(value) => onModeChange(value as AuthDialogMode)}
            className="gap-5"
          >
            <TabsList aria-label={t('tabsLabel')} className="grid h-11 w-full grid-cols-2 rounded-lg p-1">
              <TabsTrigger value="login" disabled={busy} className={tabTriggerClass}>
                {t('tabLogin')}
              </TabsTrigger>
              <TabsTrigger value="register" disabled={busy} className={tabTriggerClass}>
                {t('tabRegister')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm {...formProps} notice={notice} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm {...formProps} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
