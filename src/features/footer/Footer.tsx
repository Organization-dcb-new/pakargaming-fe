import { useTranslations } from 'next-intl'
import FooterBrand from '@/features/footer/components/FooterBrand'
import FooterContact from '@/features/footer/components/FooterContact'
import FooterCopyright from '@/features/footer/components/FooterCopyright'
import FooterCompliance from '@/features/footer/components/FooterCompliance'
import FooterInformation from '@/features/footer/components/FooterInformation'
import FooterFrame from '@/features/footer/components/FooterFrame'
import SecurePayment from '@/features/footer/components/SecurePayment'
import SocialMedia from '@/features/footer/components/SocialMedia'

export function Footer() {
  const t = useTranslations('Footer')

  return (
    <FooterFrame>
      {/* Brand + navigation columns */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <FooterBrand />
        </div>

        <nav
          className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:col-span-8 lg:gap-8"
          aria-label={t('navLabel')}
        >
          <FooterContact />
          <FooterInformation />
          <SocialMedia />
        </nav>
      </div>

      {/* Payment methods */}
      <div className="mt-10 border-t border-border pt-8 lg:mt-12">
        <SecurePayment />
      </div>

      {/* Consumer complaints + security badges */}
      <div className="mt-8 border-t border-border pt-8">
        <FooterCompliance />
      </div>

      <FooterCopyright />
    </FooterFrame>
  )
}
