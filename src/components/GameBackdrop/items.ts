export type BackdropIcon = 'diamond' | 'coin' | 'gamepad' | 'sparkle' | 'potion' | 'heart' | 'bolt'

export type BackdropItem = {
  icon: BackdropIcon
  /** Posisi pusat item, relatif ke viewport */
  x: string
  y: string
  /** Lebar di desktop; mobile otomatis 70% */
  size: string
  rotate?: number
  /** Durasi & delay siklus animasi (detik). Delay negatif = mulai di tengah siklus, supaya tidak serempak */
  duration: number
  delay: number
  /** Pengali opacity, untuk kesan jarak (item "jauh" lebih pudar) */
  depth?: number
  /** Disembunyikan di mobile: konten selebar layar, jadi item cukup sedikit */
  desktopOnly?: boolean
}

// Item dominan di sisi kiri/kanan (gutter konten max-w-7xl). Tengah hanya diisi item kecil & pudar.
export const BACKDROP_ITEMS: BackdropItem[] = [
  // Kiri
  { icon: 'diamond', x: '5%', y: '16%', size: '3.5rem', rotate: -12, duration: 9, delay: -2 },
  { icon: 'sparkle', x: '12%', y: '31%', size: '1.5rem', duration: 4, delay: -1, desktopOnly: true },
  { icon: 'coin', x: '4%', y: '47%', size: '2.75rem', rotate: 10, duration: 7, delay: -4 },
  { icon: 'bolt', x: '14%', y: '58%', size: '1.75rem', rotate: 12, duration: 6, delay: -3, desktopOnly: true },
  { icon: 'gamepad', x: '8%', y: '72%', size: '4rem', rotate: -8, duration: 10, delay: -6, desktopOnly: true },
  { icon: 'heart', x: '5%', y: '90%', size: '2rem', rotate: -6, duration: 8, delay: -1 },

  // Kanan
  { icon: 'coin', x: '91%', y: '11%', size: '2.25rem', rotate: -10, duration: 8, delay: -5 },
  { icon: 'sparkle', x: '85%', y: '22%', size: '1.25rem', duration: 5, delay: -2, desktopOnly: true },
  { icon: 'potion', x: '94%', y: '35%', size: '3.25rem', rotate: 8, duration: 9, delay: -3 },
  { icon: 'diamond', x: '88%', y: '58%', size: '2.5rem', rotate: 14, duration: 8, delay: -7, desktopOnly: true },
  { icon: 'sparkle', x: '95%', y: '72%', size: '1.75rem', duration: 4.5, delay: -3 },
  { icon: 'gamepad', x: '90%', y: '88%', size: '3rem', rotate: 10, duration: 11, delay: -2, desktopOnly: true },

  // Tengah — kecil & pudar supaya tidak bersaing dengan teks
  { icon: 'sparkle', x: '30%', y: '9%', size: '1rem', duration: 5, delay: -4, depth: 0.6, desktopOnly: true },
  { icon: 'sparkle', x: '64%', y: '6%', size: '1.25rem', duration: 4, delay: -2, depth: 0.6 },
  { icon: 'diamond', x: '70%', y: '93%', size: '1.75rem', rotate: -14, duration: 9, delay: -5, depth: 0.6, desktopOnly: true },
  { icon: 'coin', x: '38%', y: '95%', size: '1.5rem', rotate: 6, duration: 7, delay: -1, depth: 0.6, desktopOnly: true },
]
