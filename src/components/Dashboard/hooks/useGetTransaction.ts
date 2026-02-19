// hooks/useGetTransactionByEmail.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../api/axios'
import ResponseStatsDashboard, { TransactionResponseDetail } from '../types/transactions'

export interface GetTransactionResponsesDashboard extends ResponseStatsDashboard {}

export function useGetTransactionByEmailDashboard(email?: string) {
  return useQuery<GetTransactionResponsesDashboard>({
    queryKey: ['transactions-dashboard', email],
    queryFn: async () => {
      if (!email) throw new Error('Email is required')

      const res = await api.get<ResponseStatsDashboard>(`/v1/transactions/email/dashboard/${email}`)
      return res.data
    },
    enabled: !!email,
  })
}
