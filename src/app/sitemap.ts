import { MetadataRoute } from 'next'
import { routing } from '../i18n/routing'
import { serverApi } from '../api/axios'
import { GetGamesResponse } from '../types/Game'

const pages = [
  '', // homepage
  'top-up-ml',
  'top-up-free-fire',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_SITE_BASE_URL

  let gameUrls: MetadataRoute.Sitemap = []

  try {
    const { data: games } = await serverApi.get<GetGamesResponse>('/v1/games', {
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
