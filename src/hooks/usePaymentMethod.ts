import { useQuery } from '@tanstack/react-query'
import { GetPaymentMethodResponse } from '../types/PaymentMethod'
import { api } from '../api/axios'

export function useGetPaymentMethod() {
  const { data, isLoading } = useQuery<GetPaymentMethodResponse>({
    queryKey: ['get-payment-methods'],
    queryFn: async () => {
      const res = await api.get('payment-methods')
      return res.data
    },
  })

  return { data, isLoading }
}
