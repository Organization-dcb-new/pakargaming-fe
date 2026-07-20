import { useMutation } from '@tanstack/react-query'
import { api } from '../../../api/axios'

export interface ReferralCodeResponse {
  status: string;
  message: string;
  data: {
    id: string;
    name: string;
    code: string;
    percent: number;
    is_active: boolean;
  };
}

export function useCheckReferralCode() {
  return useMutation({
    mutationFn: async (code: string): Promise<ReferralCodeResponse> => {
      const res = await api.get(`/v1/referral-codes/code/${code}`)
      return res.data
    }
  })
}
