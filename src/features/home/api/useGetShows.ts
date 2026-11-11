import { useQuery } from "@tanstack/react-query"
import { api } from "@/api/client"
import { ShowResponse } from "@/features/home/types/show"
import { useRegion } from "@/hooks/useRegion"

/** Etalase beranda: tiap game diganti versi region pilihan pembeli; yang tak dijual di region itu tidak tampil. */
export const useGetShows = () => {
  const { region } = useRegion()
  return useQuery<ShowResponse>({
    queryKey: ['shows', region],
    queryFn: async () => {
      const res = await api.get('/v1/shows', { params: { region } })
      return res.data
    },
  })
}
