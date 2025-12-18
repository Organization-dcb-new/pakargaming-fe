import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/axios'
import { CategoryResponse } from '../types/Category'

export function useGetCategory() {
  const { data, isLoading } = useQuery<CategoryResponse>({
    queryKey: ['get-category'],
    queryFn: async () => {
      const res = await api.get('/categories')
      return res.data
    },
  })

  return { data, isLoading }
}
