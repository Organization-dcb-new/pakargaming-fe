/** Isi cookie `user` — bentuknya sama untuk login Google maupun email + password. */
export interface AuthUser {
  name: string
  email: string
  picture?: string | null
}

/** `data` dari POST /v1/auth/login & /v1/auth/register. */
export interface AuthSession {
  token: string
  user: AuthUser
}

/** `data` dari GET /v1/auth/me & POST /v1/auth/google/link. */
export interface AuthMe {
  id: string
  name: string
  email: string
  avatar_url?: string | null
  has_password: boolean
  google_linked: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}
