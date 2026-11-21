import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import { BannerResponse } from '@/features/home/types/banner'

export const useGetBanners = () =>
  useQuery<BannerResponse>({
    queryKey: ['banners'],
    queryFn: async () => {
      const res = await api.get('/v1/banners')
      return res.data
    },
  })
