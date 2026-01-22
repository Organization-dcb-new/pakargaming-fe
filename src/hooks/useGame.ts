import { useQuery } from '@tanstack/react-query'
import {
  GetGameResponse,
  GetGamesByCategoryResponse,
  GetGamesBySearchResponse,
  GetGamesResponse,
} from '../types/Game'
import { api } from '../api/axios'

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

export function useCatalogGame(letter: string) {
  const { data, isLoading, isError, refetch } = useQuery<GetGamesResponse>({
    queryKey: ['get-games-catalog', letter],
    queryFn: async () => {
      const res = await api.get('/v1/games/letter', {
        params: {
          letter,
        },
      })
      return res.data
    },
  })

  return { data, isLoading, isError, refetch }
}

export function useGetGameByCategory() {
  const { data, isLoading, isError, refetch } = useQuery<GetGamesByCategoryResponse>({
    queryKey: ['get-games-category'],
    queryFn: async () => {
      const res = await api.get('/v1/games/by-categories')
      return res.data
    },
  })

  return { data, isLoading, isError, refetch }
}

export function useGetGameBySearch(search: string) {
  return useQuery<GetGamesBySearchResponse>({
    queryKey: ['games-search', search],
    enabled: !!search,
    queryFn: async () => {
      const res = await api.get('/v1/games/search', {
        params: { search },
      })
      return res.data
    },
  })
}
