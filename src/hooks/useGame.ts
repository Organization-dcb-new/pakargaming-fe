import { useQuery } from '@tanstack/react-query'
import { GetGameResponse, GetGamesResponse } from '../types/Game'
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
