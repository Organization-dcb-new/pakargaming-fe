import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import { CategoryProductListResponse } from '@/features/game-topup/types/categoryProduct'

export const useGetCategoryProduct = (id: string) =>
  useQuery<CategoryProductListResponse>({
    queryKey: ['categories-product', id],
    queryFn: async () => {
      const res = await api.get(`/v1/category-product/by-game/${encodeURIComponent(id)}`)
      return res.data
    },
    enabled: !!id,
  })
