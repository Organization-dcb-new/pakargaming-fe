import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import VerifyEmail from '@/features/auth/components/VerifyEmail'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'VerifyEmail' })

  return {
    title: t('metaTitle'),
    // Halaman bertoken: jangan diindeks
    robots: { index: false, follow: false },
  }
}

/**
 * Link email backend: `<origin>/verify-email?token=...` (tanpa prefix bahasa) → middleware next-intl
 * redirect ke `/id/verify-email?token=...` (query ikut terbawa), sama seperti link atur password.
 */
export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>
}) {
  const { token } = await searchParams
  const value = Array.isArray(token) ? token[0] : token

  return <VerifyEmail token={value?.trim() || null} />
}
