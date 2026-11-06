import { useMutation } from '@tanstack/react-query'
import { api } from '../../../api/axios'
import axios from 'axios'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

type CheckIDPayloadV2 = {
  category_code: string
  game_id: string
  provider_id: string
  game_data: Record<string, string>
}

export function useCheckIDV2() {
  const t = useTranslations('GameCheckout')

  return useMutation({
    mutationFn: async (payload: CheckIDPayloadV2) => {
      const res = await api.post('/v1/transactions/check-id', payload)

      return res.data
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) {
          toast.error(t('toastAccountNotFound'))
          return
        }
      }
      toast.error(t('toastCheckIdFailed'))
    },
  })
}
