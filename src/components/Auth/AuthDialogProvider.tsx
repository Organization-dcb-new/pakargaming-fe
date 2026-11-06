'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import AuthDialog from './AuthDialog'
import type { AuthDialogMode, AuthDialogNotice, OpenAuthDialogOptions } from './types'

interface AuthDialogContextValue {
  openAuthDialog: (options?: OpenAuthDialogOptions) => void
}

const AuthDialogContext = createContext<AuthDialogContextValue | null>(null)

interface DialogState {
  open: boolean
  mode: AuthDialogMode
  notice?: AuthDialogNotice
}

/**
 * Satu dialog auth untuk seluruh app. Dibuka dari tombol "Masuk" (navbar desktop & mobile),
 * dari redirect Google (`?auth_error=...`), halaman reset password, dan kartu "Metode masuk".
 */
export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DialogState>({ open: false, mode: 'login' })
  const emailDraft = useRef('')

  const openAuthDialog = useCallback((options: OpenAuthDialogOptions = {}) => {
    emailDraft.current = options.email ?? ''
    setState({ open: true, mode: options.mode ?? 'login', notice: options.notice })
  }, [])

  const onOpenChange = useCallback((open: boolean) => setState((prev) => ({ ...prev, open })), [])
  const onModeChange = useCallback(
    (mode: AuthDialogMode) => setState((prev) => ({ ...prev, mode })),
    [],
  )

  const value = useMemo(() => ({ openAuthDialog }), [openAuthDialog])

  return (
    <AuthDialogContext.Provider value={value}>
      {children}
      <AuthDialog
        open={state.open}
        mode={state.mode}
        notice={state.notice}
        emailDraft={emailDraft}
        onOpenChange={onOpenChange}
        onModeChange={onModeChange}
      />
    </AuthDialogContext.Provider>
  )
}

export function useAuthDialog() {
  const context = useContext(AuthDialogContext)
  if (!context) throw new Error('useAuthDialog must be used within <AuthDialogProvider>')
  return context
}
