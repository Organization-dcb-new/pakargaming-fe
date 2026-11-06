import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ResetPassword from '../../../../components/ResetPassword/ResetPassword'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ResetPassword' })

  return {
    title: t('metaTitle'),
    // Halaman bertoken: jangan diindeks
    robots: { index: false, follow: false },
  }
}

/**
 * Link email backend: `<origin>/auth/reset-password?token=...` (tanpa prefix bahasa) →
 * middleware next-intl redirect ke `/id/auth/reset-password?token=...` (query ikut terbawa).
 */
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>
}) {
  const { token } = await searchParams
  const value = Array.isArray(token) ? token[0] : token

  return <ResetPassword token={value?.trim() || null} />
}
