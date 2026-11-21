// types/transaction.ts
export interface GuideOVO {
  // Sesuaikan dengan struktur guide yang dikirim backend
  step: string
  description: string
  url?: string
}

export interface PaymentResponseDetail {
  id: string
  payment_number: string
  order_id: string
  amount: number
  status: 'Success' | 'Pending' | 'Failed'
  payment_method_id: string
  payment_channel: string
  payment_url: string
  qr_code_url?: string
  qr_string?: string
  va_number?: string
  game_name: string
  game_image: string
  game_item: string
  guide: GuideOVO
  created_at: string
}

export interface TransactionResponseDetail {
  total_transactions: number
  total_amount: number
  transactions_pending: number
  transactions_failed: number
  transactions_paid: number
  transaction_detail: PaymentResponseDetail[]
}

export default interface ResponseStatsDashboard {
  data: TransactionResponseDetail
  message: string
  status: string
}
