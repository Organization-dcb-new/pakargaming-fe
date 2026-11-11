/**
 * Data situs yang dipakai di banyak tempat (footer, tombol CS, halaman maintenance, legal, checkout).
 * Ubah kontak / link di sini saja — jangan hardcode di komponen (rules §8).
 */

const WHATSAPP_NUMBER = '6285111344262'

export const CONTACT = {
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappDisplay: '+62 851-1134-4262',
  whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}`,
  email: 'cs@pakargaming.id',
  emailUrl: 'mailto:cs@pakargaming.id',
} as const

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/pakargaming.id/',
  whatsapp: CONTACT.whatsappUrl,
} as const

export const EXTERNAL_LINKS = {
  blog: 'https://blog.pakargaming.id',
} as const

/** Nama dagang yang tampil ke publik (beda dengan nama badan hukum di i18n `brandName`). */
export const SITE_NAME = 'PakarGaming'

/**
 * Logo dari env supaya bucket dev/prod tidak tertanam di bundle.
 * Kosong → FooterLogo memakai logo lokal + wordmark (URL bucket dev lama sudah 404).
 */
export const SITE_LOGO_SRC = process.env.NEXT_PUBLIC_FOOTER_LOGO_URL || null
