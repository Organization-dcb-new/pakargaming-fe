import { useTranslations } from 'next-intl'
import LegalDocument from '@/features/legal/components/LegalDocument'
import { PRIVACY_POLICY_SECTIONS, PRIVACY_POLICY_UPDATED } from '@/features/legal/content/privacyPolicy'

export default function PrivacyPolicy() {
  const t = useTranslations('Legal')

  return (
    <LegalDocument
      title={t('privacyTitle')}
      intro={t('privacyIntro')}
      lastUpdated={PRIVACY_POLICY_UPDATED}
      sections={PRIVACY_POLICY_SECTIONS}
    />
  )
}
