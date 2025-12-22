import { ApiResponse } from './Global'

export interface PaymentData {
  id: string
  payment_number: string
  order_id: string
  amount: number
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | string
  payment_method_id: string
  payment_channel: string

  payment_url: string
  qr_code_url: string
  qr_string: string
  va_number: string

  guide: PaymentGuide
  created_at: string
}

export interface PaymentGuide {
  en: string
  id: string
}

export type GetTransactionResponse = ApiResponse<PaymentData>
