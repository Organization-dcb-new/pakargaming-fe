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
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ForgotPasswordForm from './ForgotPasswordForm'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { AUTH_DIALOG_MUTATION_KEY } from '@/features/auth/api/auth'
import type { AuthDialogMode, AuthDialogNotice } from '@/features/auth/types/authDialog'

interface AuthDialogProps {
  open: boolean
  mode: AuthDialogMode
  notice?: AuthDialogNotice
  /** Email terakhir yang diketik — dibaca saat form (re)mount supaya ikut terbawa antar mode. */
  emailDraft: MutableRefObject<string>
  onOpenChange: (open: boolean) => void
  onModeChange: (mode: AuthDialogMode) => void
}

/** Tab jajar genjang seperti chip kategori; label dimiringkan balik (span skew-x-12) supaya tegak. */
const tabTriggerClass =
  'h-full -skew-x-12 cursor-pointer rounded-sm border border-border bg-muted/60 font-semibold text-muted-foreground transition-colors duration-200 hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm dark:border-border dark:text-muted-foreground dark:data-[state=active]:border-primary dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground motion-reduce:transition-none'

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
      <DialogContent className="chamfer max-h-[calc(100dvh-2rem)] gap-5 overflow-y-auto overscroll-contain rounded-none border-0 bg-card p-6 [--chamfer:20px] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-brand sm:max-w-md">
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
            <TabsList aria-label={t('tabsLabel')} className="grid h-11 w-full grid-cols-2 gap-2 rounded-none bg-transparent p-0 px-1.5">
              <TabsTrigger value="login" disabled={busy} className={tabTriggerClass}>
                <span className="skew-x-12">{t('tabLogin')}</span>
              </TabsTrigger>
              <TabsTrigger value="register" disabled={busy} className={tabTriggerClass}>
                <span className="skew-x-12">{t('tabRegister')}</span>
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
