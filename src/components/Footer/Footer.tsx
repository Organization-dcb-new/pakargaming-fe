'use client'

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
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 lg:pb-2">
        <aside className="flex flex-col items-center text-center lg:col-span-4 lg:items-start lg:text-left">
          <BrandComponent />
        </aside>

        <div className="flex flex-col gap-12 lg:col-span-8">
          <SecurePayment />

          <nav
            className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-8"
            aria-label={t('navLabel')}
          >
            <ContactComponent />
            <Information />
            <div className="flex justify-center sm:col-span-2 lg:col-span-1 lg:justify-start">
              <SocialMediaComponent />
            </div>
          </nav>

          <EtcComponent />
        </div>
      </div>

      <CopyrightComponent />
    </LayoutFooter>
  )
}
