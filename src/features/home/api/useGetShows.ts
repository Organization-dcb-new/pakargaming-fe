import { useQuery } from "@tanstack/react-query"
import { api } from "@/api/client"
import { ShowResponse } from "@/features/home/types/show"

export const useGetShows = () =>
  useQuery<ShowResponse>({
    queryKey: ['shows'],
    queryFn: async () => {
      const res = await api.get('/v1/shows')
      return res.data
    },
  })
