import { OPTIMIZED_IMAGE_HOSTS } from '@/config/images'

function hostMatches(host: string, pattern: string) {
  if (pattern.startsWith('**.')) return host.endsWith(pattern.slice(2))
  if (pattern.startsWith('*.')) {
    const base = pattern.slice(1)
    return host.endsWith(base) && !host.slice(0, -base.length).includes('.')
  }
  return host === pattern
}

/**
 * Boleh lewat optimizer next/image? Pakai sebagai `unoptimized={!canOptimize(src)}`.
 * Tidak: SVG (optimizer menolak), host yang belum terdaftar di OPTIMIZED_IMAGE_HOSTS, atau src kosong.
 */
export function canOptimize(src: string | null | undefined): boolean {
  if (!src) return false
  if (src.startsWith('/')) return !src.split('?')[0].toLowerCase().endsWith('.svg')
  try {
    const url = new URL(src)
    if (url.protocol !== 'https:' || url.pathname.toLowerCase().endsWith('.svg')) return false
    return OPTIMIZED_IMAGE_HOSTS.some((pattern) => hostMatches(url.hostname, pattern))
  } catch {
    return false
  }
}
