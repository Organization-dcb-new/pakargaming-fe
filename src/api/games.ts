import { useQuery } from '@tanstack/react-query'
import { GetGameResponse, GetGamesBySearchResponse } from '@/types/game'
import { useRegion } from '@/hooks/useRegion'
import { api } from './client'

export function useGetGamesBySlug(slug: string) {
  const { data, isLoading } = useQuery<GetGameResponse>({
    queryKey: ['get-games-slug', slug],
    queryFn: async () => {
      const res = await api.get(`/v1/games/slug/${encodeURIComponent(slug)}`)
      return res.data
    },
  })

  return { data, isLoading }
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
