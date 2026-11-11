import { ApiResponse } from "./api";

export interface PaymentConfig {
  note: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  type: string;
  provider: string;
  icon_url: string;
  fee_percentage: number;
  fee_fixed: number;
  min_amount: number;
  max_amount: number;
  full_name: string;
  sort_order: number;
  config: PaymentConfig;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_id: string;
  /** Khusus UI (tidak dikirim ke backend): alasan metode nonaktif, mis. "Min. pembelian Rp 10.000" */
  disabled_note?: string;
}

export interface PaymentMethodCategoryWithPaymentMethodResponse {
  id: string;
  name: string;
  slug: string;
  icon_url: string;
  payment_method: PaymentMethod[];
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type GetPaymentMethodResponse = ApiResponse<
  PaymentMethodCategoryWithPaymentMethodResponse[]
>;
