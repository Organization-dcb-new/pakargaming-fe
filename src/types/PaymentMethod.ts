import { ApiResponse } from './Global'

export interface PaymentConfig {
  note: string
}

export interface PaymentMethod {
  id: string
  name: string
  code: string
  type: string
  provider: string
  icon_url: string
  fee_percentage: number
  fee_fixed: number
  min_amount: number
  max_amount: number
  full_name: string
  sort_order: number
  config: PaymentConfig
  is_active: boolean
  created_at: string
  updated_at: string
  category_id: string
}

export interface PaymentMethodCategoryWithPaymentMethodResponse {
  id: string
  name: string
  slug: string
  icon_url: string
  payment_method: PaymentMethod[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export type GetPaymentMethodResponse = ApiResponse<PaymentMethodCategoryWithPaymentMethodResponse[]>
