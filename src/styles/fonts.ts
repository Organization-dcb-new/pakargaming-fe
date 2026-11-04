import { Chakra_Petch, Plus_Jakarta_Sans } from 'next/font/google'

/** Display — heading, wordmark, angka. Bersudut seperti logo; jangan dipakai untuk teks panjang. */
export const fontDisplay = Chakra_Petch({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-chakra',
  display: 'swap',
})

/** Body — teks UI & konten. */
export const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})
