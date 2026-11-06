import { notFound } from 'next/navigation'

// Path yang tidak cocok dengan route mana pun di bawah /[locale] → tampilkan [locale]/not-found.tsx
// (dengan navbar, footer & terjemahan), bukan 404 default Next.js.
export default function CatchAllPage() {
  notFound()
}
