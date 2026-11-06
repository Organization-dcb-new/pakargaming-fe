import { useQuery } from '@tanstack/react-query'
import { GetTransactionResponseWithDetailProduct } from '../../../types/Transaction'
import { api } from '../../../api/axios'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export function useGetTransactionByPaymentNumber(id: string) {
  const t = useTranslations('CheckTransaction')
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
          toast.error(t('toastNotFound'))
        } else {
          toast.error(t('toastError'))
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
