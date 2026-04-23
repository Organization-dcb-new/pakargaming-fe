'use client'

import useLoginGoogleOauth from "../../../../hooks/useLogin"
import { useTranslations } from 'next-intl'

export default function GoogleCallbackPage() {
  const t = useTranslations('Auth')
  useLoginGoogleOauth()
  return <p className="text-center mt-10">{t('loggingIn')}</p>
}
