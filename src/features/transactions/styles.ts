/** Kelas tombol halaman detail transaksi — sama dengan CTA di ConfirmModal & NotFound (rules §2.2). */

/** Ring fokus untuk elemen di atas kartu (offset warna `card`, bukan `background`). */
export const focusRingOnCard =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card'

export const btnPrimary = `chamfer flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors duration-200 hover:bg-primary/85 motion-reduce:transition-none ${focusRingOnCard}`

export const btnSecondary = `flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-border px-6 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary hover:text-primary motion-reduce:transition-none ${focusRingOnCard}`

/** Permukaan skeleton — bentuk chamfer sama dengan HudPanel (panel asli memakai <HudPanel>) */
export const surface = 'chamfer bg-card [--chamfer:20px]'
