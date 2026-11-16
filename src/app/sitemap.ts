import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { serverApi } from '@/api/serverClient'
import { GetGamesResponse } from '@/types/game'

/** Halaman publik statis (tanpa /dashboard yang butuh login). Halaman top-up per game ditambahkan di bawah. */
const pages = ['', 'check-transaction', 'about', 'policy-and-privacy', 'term-and-condition']

/**
 * Dibuat saat diminta, bukan saat `next build`: NEXT_SITE_BASE_URL & URL backend ada di .env server, dan
 * daftar game harus diambil dari server FE — backend menolak IP runner build (dulu sitemap production
 * dibangun di runner CI, jadi daftar gamenya kosong).
 */
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_SITE_BASE_URL

  let gameUrls: MetadataRoute.Sitemap = []

  try {
    // The storefront catalog: /v1/games is the admin panel's and answered 401 here.
    const { data: games } = await serverApi.get<GetGamesResponse>('/v1/games/letter', {
      // Every region's game pages (mobile-legends, mobile-legends-my, …), not just the buyer's.
      params: { letter: 'all', region: 'all' },
      timeout: 5000,
    })

    gameUrls =
      games.data?.flatMap((game) => {
        return routing.locales.map((locale) => ({
          url: `${baseUrl}/${locale}/games/${game.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.8,
        }))
      }) ?? []
  } catch (error) {
    console.error('Sitemap Fetch Error:', error)
  }

  const staticUrls: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page ? `/${page}` : ''}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: page === '' ? 1 : 0.9,
    }))
  )

  return [...staticUrls, ...gameUrls]
}
