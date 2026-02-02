import { ApiResponse, ApiResponseWithMeta } from './Global'

export interface PaymentData {
  id: string
  payment_number: string
  order_id: string
  amount: number
  status: 'PENDING' | 'PAID' | 'FAILED' | string
  payment_method_id: string
  payment_channel: string

  payment_url: string
  qr_code_url: string
  qr_string: string
  va_number: string

  guide: PaymentGuide
  created_at: string
}

export interface PaymentDataWithGameData {
  id: string
  payment_number: string
  order_id: string
  amount: number
  status: 'PENDING' | 'PAID' | 'FAILED' | string
  payment_method_id: string
  payment_channel: string

  payment_url: string
  qr_code_url: string
  qr_string: string
  va_number: string
  game_name: string
  game_image: string
  game_item: string

  guide: PaymentGuide
  created_at: string
}

export interface PaymentDataWithDetailProduct {
  id: string
  payment_number: string
  order_id: string
  amount: number
  status: 'PENDING' | 'PAID' | 'FAILED' | string
  payment_method_id: string
  payment_channel: string
  detail_product: DetailProduct
  payment_url: string
  qr_code_url: string
  qr_string: string
  va_number: string

  guide: PaymentGuide
  created_at: string
}

export interface DetailProduct {
  item_name: string
  item_product: string
  item_quantity: number
  item_image: string
  email: string
  category: string
  payment_image: string
  game_slug: string
  voucher_code: string
  payment_name: string
}

export interface PaymentGuide {
  en: string
  id: string
}
export type GetTransactionResponseWithDetailProduct = ApiResponse<PaymentDataWithDetailProduct>

export type GetTransactionResponse = ApiResponse<PaymentData>
export type GetTransactionResponses = ApiResponseWithMeta<PaymentDataWithGameData[]>
