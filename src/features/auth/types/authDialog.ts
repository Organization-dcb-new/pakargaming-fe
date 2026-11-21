export type AuthDialogMode = 'login' | 'register' | 'forgot'

/** Pesan info yang ditampilkan di atas form Masuk, mis. setelah redirect `?auth_error=google_email_registered`. */
export type AuthDialogNotice = 'googleEmailRegistered'

export interface OpenAuthDialogOptions {
  mode?: AuthDialogMode
  /** Prefill email (mis. dari kartu "Metode masuk" di dasbor). */
  email?: string
  notice?: AuthDialogNotice
}

/** Props bersama form di dalam dialog auth. */
export interface AuthFormProps {
  defaultEmail: string
  /** Email yang sedang diketik — dibawa saat pindah Masuk ↔ Daftar ↔ Lupa password. */
  onEmailChange: (email: string) => void
  onSwitchMode: (mode: AuthDialogMode) => void
  /** Tutup dialog (setelah berhasil masuk/daftar). */
  onDone: () => void
}
