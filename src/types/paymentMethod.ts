import { ApiResponse } from "./api";

/**
 * Metode pembayaran seperti yang ditawarkan checkout (GET /v1/payment-categories/client). Backend
 * hanya mengirim yang dilihat pembeli dan yang akan ditagih checkout — bukan cara metode diatur.
 */
export interface PaymentMethod {
  /** Dikirim balik sebagai payment_method_id saat checkout. */
  id: string;
  name: string;
  icon_url: string;
  /** Total = harga + harga × fee_percent / 100 + fee_fixed (salah satunya 0). */
  fee_percent: number;
  fee_fixed: number;
  /** Total yang diterima checkout; 0 = tanpa batas. */
  min_total: number;
  max_total: number;
  /** Tagihan dikirim ke HP pembeli (OVO): checkout minta nomor HP. */
  needs_phone: boolean;
  /** false: metode sedang tidak bisa dipakai (tampil abu-abu). */
  available: boolean;
  /** Khusus UI (tidak dari backend): alasan metode tidak bisa dipilih untuk nominal ini. */
  disabled_note?: string;
}

export interface PaymentCategory {
  name: string;
  icon_url: string;
  methods: PaymentMethod[];
}

export type GetPaymentMethodResponse = ApiResponse<PaymentCategory[]>;
