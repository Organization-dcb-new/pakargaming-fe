import { useQuery } from '@tanstack/react-query'
import { GetTransactionResponseWithDetailProduct } from '../../../types/Transaction'
import { api } from '../../../api/axios'
import { toast } from 'sonner'

export function useGetTransactionByPaymentNumber(id: string) {
  const query = useQuery<GetTransactionResponseWithDetailProduct>({
    queryKey: ['get-transaction-detail-v2', id],
    enabled: !!id,
    retry: false,

    queryFn: async () => {
      try {
        const res = await api.get(`/v1/transactions/detail-trx/${id}`)
        return res.data
      } catch (error: any) {
        if (
          error?.response?.status === 404 ||
          error?.response?.data?.message === 'record not found'
        ) {
          toast.error('Transaksi tidak ditemukan')
        } else {
          toast.error('Terjadi kesalahan, coba lagi')
        }
        throw error
      }
    },
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
  }
}
