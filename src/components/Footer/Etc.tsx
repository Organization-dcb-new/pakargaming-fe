import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FOOTER_CONTACT, footerLinkSmClass } from './config'

export default function EtcComponent() {
  const t = useTranslations('Footer')

  return (
    <div className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-x-10 sm:gap-y-6">
      <div className="flex max-w-md flex-col gap-2">
        <span className="text-xs font-medium text-foreground">{t('consumerComplaints')}</span>

        <div className="flex flex-col gap-2 text-xs">
          <a
            href={FOOTER_CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-fit ${footerLinkSmClass}`}
          >
            {FOOTER_CONTACT.whatsappDisplay}
          </a>

          <a href={FOOTER_CONTACT.emailUrl} className={`w-fit break-all ${footerLinkSmClass}`}>
            {FOOTER_CONTACT.email}
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:items-end">
        <p className="text-xs font-medium text-foreground sm:text-right">{t('securityPrivacy')}</p>
        {/* Badge sertifikasi pihak ketiga dirancang untuk latar terang → plat putih */}
        <div className="flex flex-row items-center gap-3 sm:justify-end">
          <span className="flex h-11 items-center rounded-md bg-white px-2 shadow-sm ring-1 ring-border">
            <Image
              src="/ssl.webp"
              alt="SSL secure"
              width={120}
              height={40}
              sizes="120px"
              className="h-8 w-auto object-contain"
            />
          </span>
          <span className="flex h-11 items-center rounded-md bg-white px-2 shadow-sm ring-1 ring-border">
            <Image
              src="/kan.webp"
              alt="Privacy certification"
              width={120}
              height={40}
              sizes="120px"
              className="h-8 w-auto object-contain"
            />
          </span>
        </div>
      </div>
    </div>
  )
}
