'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { PublicEnv } from '@/config/runtimeEnv'

const EMPTY_PUBLIC_ENV: PublicEnv = {
  apiBaseUrl: '',
  turnstileSiteKey: '',
  gaMeasurementId: '',
  footerLogoUrl: '',
}

const PublicEnvContext = createContext<PublicEnv>(EMPTY_PUBLIC_ENV)

/**
 * Konfigurasi publik dari .env server untuk komponen client (site key Turnstile, id GA, logo, base URL
 * backend). Nilainya dibaca layout saat runtime (getPublicEnv), bukan di-inline saat build — lihat
 * src/config/runtimeEnv.ts.
 */
export default function PublicEnvProvider({ value, children }: { value: PublicEnv; children: ReactNode }) {
  return <PublicEnvContext.Provider value={value}>{children}</PublicEnvContext.Provider>
}

export function usePublicEnv(): PublicEnv {
  return useContext(PublicEnvContext)
}
