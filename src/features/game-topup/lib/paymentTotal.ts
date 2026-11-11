import { PaymentMethod } from '@/types/paymentMethod'

/** Yang dibayar pembeli untuk produk seharga `price` dengan metode ini — sama dengan hitungan checkout. */
export function paymentTotal(method: PaymentMethod, price: number): number {
  return Math.round(price + (price * (method.fee_percent || 0)) / 100 + (method.fee_fixed || 0))
}

/** Batas total yang dilanggar metode untuk harga ini: 'min', 'max', atau null bila boleh. */
export function paymentTotalLimit(method: PaymentMethod, price: number): 'min' | 'max' | null {
  const total = paymentTotal(method, price)
  if (method.min_total > 0 && total < method.min_total) return 'min'
  if (method.max_total > 0 && total > method.max_total) return 'max'
  return null
}
