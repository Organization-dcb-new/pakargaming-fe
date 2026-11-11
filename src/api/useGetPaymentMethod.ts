import { useQuery } from '@tanstack/react-query'
import { GetPaymentMethodResponse } from '@/types/paymentMethod'
import { api } from './client'

export function useGetPaymentMethod() {
  const { data, isLoading, isError } = useQuery<GetPaymentMethodResponse>({
    queryKey: ['get-payment-methods'],
    queryFn: async () => {
      const res = await api.get('/v1/payment-categories/client')
      return res.data
    },
  })

  return { data, isLoading, isError }
}
