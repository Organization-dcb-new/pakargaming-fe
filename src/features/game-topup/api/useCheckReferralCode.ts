import { useMutation } from '@tanstack/react-query'
import { api } from '@/api/client'

export interface ReferralCodeResponse {
  status: string;
  message: string;
  /** Only whether the code works: the owner and the commission are not public. */
  data: {
    code: string;
    is_active: boolean;
  };
}

export function useCheckReferralCode() {
  return useMutation({
    mutationFn: async (code: string): Promise<ReferralCodeResponse> => {
      const res = await api.get(`/v1/referral-codes/code/${encodeURIComponent(code)}`)
      return res.data
    }
  })
}
