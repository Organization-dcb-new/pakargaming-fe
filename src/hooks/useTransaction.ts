import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../api/axios'
import {
  GetTransactionResponses,
  GetTransactionResponseWithDetailProduct,
} from '../types/Transaction'
import { toast } from 'sonner'
import axios from 'axios'

export function useCreateTransaction() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/v1/transactions', payload)
      return res.data
    },
    onError: () => {
      toast.error('Gagal membuat transaksi')
    },
  })
}

export function useGetTransaction(id: string) {
  const { data, isLoading } = useQuery<GetTransactionResponseWithDetailProduct>({
    queryKey: ['get-transaction-detail', id],
    queryFn: async () => {
      const res = await api.get(`/v1/transactions/${id}`)
      return res.data
    },
    refetchInterval : 5000,
    refetchIntervalInBackground : true,
  })

  return { data, isLoading }
}

export function useGetTransactionByEmail(email?: string, page = 1) {
  return useQuery<GetTransactionResponses>({
    queryKey: ['transactions', email, page],
    queryFn: async () => {
      const res = await api.get('/v1/transactions/email/' + email, {
        params: {
          page,
          limit: 10,
        },
      })
      return res.data
    },
    enabled: !!email,
  })
}

type CheckIDPayload = {
  category_code: string
  game_id: string
  provider_id: string
  game_data: Record<string, string>
}
export function useCheckID() {
  return useMutation({
    mutationFn: async (payload: CheckIDPayload) => {
      const res = await api.post('/v1/transactions/check-id', payload)

      return res.data
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const message = error.response?.data?.message || error.response?.data?.error

        if (status === 400) {
          toast.error(message || 'Akun tidak ditemukan')
          return
        }
      }

      toast.error('Gagal cek ID')
    },
  })
}
