import { useQuery } from '@tanstack/react-query'
import { api } from '../../../api/axios'
import { CategoryProductListResponse } from '../types/CategoryProduct'

export const useGetCategoryProduct = (id: string) =>
  useQuery<CategoryProductListResponse>({
    queryKey: ['categories-product', id],
    queryFn: async () => {
      const res = await api.get(`/v1/category-product/by-game/${id}`)
      return res.data
    },
    enabled: !!id,
  })
