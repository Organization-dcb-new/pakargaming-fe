import { stagger, type Variants } from 'motion/react'

/**
 * Animasi pergantian PENDING → PAID/FAILED di detail transaksi (rules §12: 150–200ms keluar, 300ms masuk).
 * Varian dijalankan dari pembungkus di TransactionDetailView; komponen di dalamnya cukup memasang
 * `variants` — kalau pembungkus memakai `initial={false}` (status tidak berubah di sesi ini), semuanya
 * langsung tampil tanpa animasi.
 */

/** Easing yang sama dengan Reveal di beranda: cepat di awal, mendarat halus. */
const EASE_OUT = [0.25, 1, 0.5, 1] as const

/** Durasi fade-out halaman checkout sebelum kartu status masuk. */
export const CHECKOUT_EXIT_SECONDS = 0.18

/** Pembungkus halaman: kartu status dulu, FAQ (khusus gagal) menyusul. */
export const revealPage: Variants = {
  hidden: {},
  show: { transition: { delayChildren: stagger(0.35) } },
}

/** Kartu status: fade + sedikit membesar, lalu isinya muncul berurutan. */
export const revealCard: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT, delayChildren: stagger(0.05, { startDelay: 0.08 }) },
  },
}

/** Isi kartu / blok halaman: fade-up kecil. */
export const revealItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } },
}

/** Glyph OK / ! — "pop" dengan pegas supaya momen hasilnya terasa. */
export const revealGlyph: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 18 } },
}

/** Bilah warna status di tepi atas kartu: tumbuh dari kiri. */
export const revealAccentBar: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.5, ease: EASE_OUT } },
}
