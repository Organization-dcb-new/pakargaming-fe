import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/client'
import { notifyAuthChange } from '@/lib/sessionClient'
import { TURNSTILE_HEADER } from '@/lib/session'
import type { ApiResponse } from '@/types/api'
import type {
  AuthMe,
  AuthSession,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from '@/types/auth'

/** Prefix mutation milik dialog auth — dipakai useIsMutating supaya dialog tidak bisa ditutup saat proses. */
export const AUTH_DIALOG_MUTATION_KEY = ['auth', 'dialog'] as const

const AUTH_ME_KEY = 'auth-me'

/** Token widget Turnstile (kosong kalau Turnstile tidak dikonfigurasi). Dikirim via header, bukan body. */
type WithCaptcha<T> = T & { captchaToken?: string | null }

function captchaHeaders(captchaToken?: string | null) {
  return captchaToken ? { [TURNSTILE_HEADER]: captchaToken } : undefined
}

export function useEmailLogin() {
  return useMutation({
    mutationKey: [...AUTH_DIALOG_MUTATION_KEY, 'login'],
    mutationFn: async ({ captchaToken, ...payload }: WithCaptcha<LoginPayload>) => {
      const res = await api.post<ApiResponse<AuthSession>>('/v1/auth/login', payload, {
        skipAuth: true,
        headers: captchaHeaders(captchaToken),
      })
      return res.data.data
    },
    // Cookie sesi sudah ditulis proxy dari respons ini
    onSuccess: () => notifyAuthChange(),
  })
}

export function useRegister() {
  return useMutation({
    mutationKey: [...AUTH_DIALOG_MUTATION_KEY, 'register'],
    mutationFn: async ({ captchaToken, ...payload }: WithCaptcha<RegisterPayload>) => {
      const res = await api.post<ApiResponse<AuthSession>>('/v1/auth/register', payload, {
        skipAuth: true,
        headers: captchaHeaders(captchaToken),
      })
      return res.data.data
    },
    onSuccess: () => notifyAuthChange(),
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationKey: [...AUTH_DIALOG_MUTATION_KEY, 'forgot-password'],
    mutationFn: async ({ captchaToken, ...payload }: WithCaptcha<ForgotPasswordPayload>) => {
      const res = await api.post<ApiResponse<unknown>>('/v1/auth/forgot-password', payload, {
        skipAuth: true,
        headers: captchaHeaders(captchaToken),
      })
      return res.data
    },
  })
}

export function useResetPassword() {
  return useMutation({
    mutationKey: ['auth', 'reset-password'],
    mutationFn: async (payload: ResetPasswordPayload) => {
      const res = await api.post<ApiResponse<unknown>>('/v1/auth/reset-password', payload, {
        skipAuth: true,
      })
      return res.data
    },
  })
}

export function useAuthMe(isLoggedIn: boolean) {
  return useQuery<AuthMe>({
    queryKey: [AUTH_ME_KEY],
    queryFn: async () => {
      const res = await api.get<ApiResponse<AuthMe>>('/v1/auth/me')
      return res.data.data
    },
    enabled: isLoggedIn,
  })
}

/** Tiket sekali pakai untuk membuka Google dalam mode link, terikat ke akun yang sedang login. */
export async function startGoogleLink(): Promise<string> {
  const res = await api.post<ApiResponse<{ ticket: string }>>('/v1/auth/google/link/start', {})
  return res.data.data.ticket
}

/** Tukar `?auth_code` dari redirect login Google dengan sesi (token tidak pernah lewat URL). */
export async function redeemGoogleSignIn(code: string): Promise<AuthSession> {
  const res = await api.post<ApiResponse<AuthSession>>('/v1/auth/google/exchange', { code }, {
    skipAuth: true,
  })
  return res.data.data
}

export function useLinkGoogle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['auth', 'google-link'],
    mutationFn: async (code: string) => {
      const res = await api.post<ApiResponse<AuthMe>>('/v1/auth/google/link', { code })
      return res.data.data
    },
    onSuccess: (me) => {
      // Respons link = bentuk /auth/me → kartu "Metode masuk" langsung ter-update
      queryClient.setQueriesData<AuthMe>({ queryKey: [AUTH_ME_KEY] }, me)
      queryClient.invalidateQueries({ queryKey: [AUTH_ME_KEY] })

      // Akun email belum punya foto; proxy sudah mengisi cookie profil dari avatar Google → navbar baca ulang
      notifyAuthChange()
    },
  })
}
