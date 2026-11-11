/** Class styling bersama untuk sub-komponen footer. */

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
