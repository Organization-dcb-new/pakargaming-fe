/**
 * Centralized static data & shared styles for the Footer.
 * Keep contact info, social links, and the logo source in one place so a change
 * only needs to happen here instead of across every sub-component.
 */

const WHATSAPP_NUMBER = '628131793708'

export const FOOTER_CONTACT = {
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappDisplay: '+62 813-1793-708',
  whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}`,
  email: 'cs@pakargaming.id',
  emailUrl: 'mailto:cs@pakargaming.id',
} as const

export const FOOTER_SOCIAL = {
  instagram: 'https://www.instagram.com/pakargaming.id/',
  whatsapp: FOOTER_CONTACT.whatsappUrl,
} as const

export const FOOTER_LINKS = {
  blog: 'https://blog.pakargaming.id',
} as const

/** Public-facing brand name (trade name, distinct from the legal entity in i18n `brandName`). */
export const FOOTER_SITE_NAME = 'PakarGaming'

/**
 * Logo is env-driven so dev/prod buckets don't get hardcoded into the bundle.
 * Unset → FooterLogo falls back to the local logo + wordmark (the old hardcoded dev-bucket URL now 404s).
 */
export const FOOTER_LOGO_SRC = process.env.NEXT_PUBLIC_FOOTER_LOGO_URL || null

/** Section headings (Contact, Information, Follow us, Secure payments). */
export const footerHeadingClass =
  'font-display text-sm font-bold uppercase tracking-wider text-foreground'

/** Base link affordances (hover + keyboard focus); size-agnostic so callers set text-* themselves. */
const footerLinkBaseClass =
  'rounded-md font-medium text-muted-foreground transition-colors duration-200 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

/** Standard footer text link. */
export const footerLinkClass = `text-sm ${footerLinkBaseClass}`

/** Fine-print footer link (consumer complaints). */
export const footerLinkSmClass = `text-xs ${footerLinkBaseClass}`

/** Contact links: icon + label sharing the same interactive affordances. */
export const footerContactLinkClass = `group inline-flex items-center gap-3 ${footerLinkClass}`
