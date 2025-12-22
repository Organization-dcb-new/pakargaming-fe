import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../api/axios'
import { GetTransactionResponse } from '../types/Transaction'
import { toast } from 'sonner'

export function useCreateTransaction() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/transactions', payload)
      return res.data
    },
    onError: () => {
      toast.error('Gagal membuat transaksi')
    },
  })
}

export function useGetTransaction(id: string) {
  const { data, isLoading } = useQuery<GetTransactionResponse>({
    queryKey: ['get-transaction-detail', id],
    queryFn: async () => {
      const res = await api.get(`/transactions/${id}`)
      return res.data
    },
  })

  return { data, isLoading }
}
