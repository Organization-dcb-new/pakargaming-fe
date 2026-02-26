import { MetadataRoute } from 'next'
import { routing } from '../i18n/routing'
import { api, apiServer } from '../api/axios'
import { GetGamesResponse } from '../types/Game'

const pages = [
  '', // homepage
  'top-up-ml',
  'top-up-free-fire',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  const { data: games } = await apiServer.get<GetGamesResponse>('/v1/games')

  const gameUrls =
    games.data?.flatMap((game) => {
      return routing.locales.map((locale) => ({
        url: `${baseUrl}/${locale}/games/${game.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }))
    }) ?? []

  const staticUrls = routing.locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page ? `/${page}` : ''}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: page === '' ? 1 : 0.9,
    }))
  )

  return [...staticUrls, ...gameUrls]
}
