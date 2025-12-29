import { useQuery } from '@tanstack/react-query'
import { api } from '../api/axios'
import { GetCategoryResponse } from '../types/Category'

export function useGetCategory() {
  const { data, isLoading, isError, refetch } = useQuery<GetCategoryResponse>({
    queryKey: ['get-category'],
    queryFn: async () => {
      const res = await api.get('/v1/categories')
      return res.data
    },
  })

  return { data, isLoading, isError, refetch }
}
