'use client'

import BrandComponent from './Brand'
import ContactComponent from './Contact'
import CopyrightComponent from './Copyright'
import EtcComponent from './Etc'
import Information from './Information'
import LayoutFooter from './Layout'
import SecurePayment from './Payment'
import SocialMediaComponent from './SocialMedia'

export function Footer() {
  return (
    <LayoutFooter>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12  max-w-5xl mx-auto">
        {/* Brand */}
        <div className="flex justify-center md:justify-end">
          <BrandComponent />
        </div>

        <div className="flex flex-col items-center md:items-start gap-4">
          <SecurePayment />
          <div className="flex flex-row gap-5">
            <ContactComponent />
            <Information />
            <SocialMediaComponent />
          </div>
          <EtcComponent />
        </div>
      </div>

      <CopyrightComponent />
    </LayoutFooter>
  )
}
