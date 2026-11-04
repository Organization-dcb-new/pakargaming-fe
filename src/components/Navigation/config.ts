import { House, ReceiptText, type LucideIcon } from 'lucide-react'

export type NavItem = {
  href: string
  /** Key di namespace `Navigation` (src/messages/*.json) */
  labelKey: 'home' | 'checkTransaction'
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', labelKey: 'home', icon: House },
  { href: '/check-transaction', labelKey: 'checkTransaction', icon: ReceiptText },
]

/** Beranda hanya aktif persis di `/`; menu lain ikut aktif di sub-halamannya. */
export function isNavActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export function getAvatarSrc(user: { name?: string; picture?: string }) {
  return (
    user.picture ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}`
  )
}
