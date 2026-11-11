import { useQuery } from '@tanstack/react-query'
import {
  GetGameResponse,
  GetGamesBySearchResponse,
  GetGamesResponse,
} from '@/types/game'
import { useRegion } from '@/hooks/useRegion'
import { api } from './client'

export function useGetGames() {
  const { data, isLoading, isError, refetch } = useQuery<GetGamesResponse>({
    queryKey: ['get-games'],
    queryFn: async () => {
      const res = await api.get('/v1/games')
      return res.data
    },
  })

  return { data, isLoading, isError, refetch }
}

export function useGetGamesBySlug(slug: string) {
  const { data, isLoading } = useQuery<GetGameResponse>({
    queryKey: ['get-games-slug', slug],
    queryFn: async () => {
      const res = await api.get(`/v1/games/slug/${slug}`)
      return res.data
    },
  })

  return { data, isLoading }
}

/** Katalog A–Z: game tampil untuk region pilihan pembeli (useRegion). */
export function useCatalogGame(letter: string) {
  const { region } = useRegion()
  const { data, isLoading, isError, refetch } = useQuery<GetGamesResponse>({
    queryKey: ['get-games-catalog', letter, region],
    queryFn: async () => {
      const res = await api.get('/v1/games/letter', {
        params: {
          letter,
          region,
        },
      })
      return res.data
    },
  })

  return { data, isLoading, isError, refetch }
}

/** Pencarian navbar: hanya game region pilihan pembeli (useRegion). */
export function useGetGameBySearch(search: string) {
  const { region } = useRegion()
  return useQuery<GetGamesBySearchResponse>({
    queryKey: ['games-search', search, region],
    enabled: !!search,
    queryFn: async () => {
      const res = await api.get('/v1/games/search', {
        params: { search, region },
      })
      return res.data
    },
  })
}
