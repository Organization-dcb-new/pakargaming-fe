import { useTranslations } from 'next-intl'
import BrandComponent from './Brand'
import ContactComponent from './Contact'
import CopyrightComponent from './Copyright'
import EtcComponent from './Etc'
import Information from './Information'
import LayoutFooter from './Layout'
import SecurePayment from './Payment'
import SocialMediaComponent from './SocialMedia'

export function Footer() {
  const t = useTranslations('Footer')

  return (
    <LayoutFooter>
      {/* Brand + navigation columns */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <BrandComponent />
        </div>

        <nav
          className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:col-span-8 lg:gap-8"
          aria-label={t('navLabel')}
        >
          <ContactComponent />
          <Information />
          <SocialMediaComponent />
        </nav>
      </div>

      {/* Payment methods */}
      <div className="mt-10 border-t border-border pt-8 lg:mt-12">
        <SecurePayment />
      </div>

      {/* Consumer complaints + security badges */}
      <div className="mt-8 border-t border-border pt-8">
        <EtcComponent />
      </div>

      <CopyrightComponent />
    </LayoutFooter>
  )
}
