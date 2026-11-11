import { useQuery } from '@tanstack/react-query'
import { GetStoreRegionsResponse } from '@/types/game'
import { api } from './client'

/** Negara yang punya game tampil, untuk pemilih region di navbar. Jarang berubah. */
export function useGetRegions() {
  return useQuery<GetStoreRegionsResponse>({
    queryKey: ['game-regions'],
    queryFn: async () => {
      const res = await api.get('/v1/games/regions')
      return res.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
