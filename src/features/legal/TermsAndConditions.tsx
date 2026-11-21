import { useTranslations } from 'next-intl'
import LegalDocument from '@/features/legal/components/LegalDocument'
import { TERMS_SECTIONS, TERMS_UPDATED } from '@/features/legal/content/termsAndConditions'

export default function TermsAndConditions() {
  const t = useTranslations('Legal')

  return (
    <LegalDocument
      title={t('termsTitle')}
      intro={t('termsIntro')}
      lastUpdated={TERMS_UPDATED}
      sections={TERMS_SECTIONS}
    />
  )
}
