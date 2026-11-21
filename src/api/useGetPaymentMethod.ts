import { useQuery } from '@tanstack/react-query'
import { GetPaymentMethodResponse, PaymentCategory, PaymentMethod } from '@/types/paymentMethod'
import { api } from './client'

export function useGetPaymentMethod() {
  const { data, isLoading, isError } = useQuery<GetPaymentMethodResponse>({
    queryKey: ['get-payment-methods'],
    queryFn: async () => {
      const res = await api.get('/v1/payment-categories/client')
      return { ...res.data, data: (res.data?.data ?? []).map(toPaymentCategory) }
    },
  })

  return { data, isLoading, isError }
}

/**
 * SEMENTARA — hapus setelah backend dengan respons ringkas rilis. Backend lama masih mengirim
 * `payment_method` dengan code/type/full_name; ini menerjemahkannya dengan aturan checkout yang sama
 * (VA & gerai: biaya tetap, lainnya persen; VA min. produk Rp10.000; OVO/Smartfren minta nomor HP),
 * supaya storefront bisa rilis lebih dulu tanpa checkout rusak.
 */
type LegacyMethod = {
  id: string
  name: string
  code?: string
  type?: string
  icon_url?: string
  full_name?: string
  fee_percentage?: number
  fee_fixed?: number
  is_active?: boolean
}
type LegacyCategory = { name: string; icon_url?: string; payment_method?: LegacyMethod[] }

function toPaymentCategory(raw: PaymentCategory | LegacyCategory): PaymentCategory {
  if ('methods' in raw) return raw
  return { name: raw.name, icon_url: raw.icon_url ?? '', methods: (raw.payment_method ?? []).map(fromLegacyMethod) }
}

function fromLegacyMethod(m: LegacyMethod): PaymentMethod {
  const code = (m.code ?? m.name).toLowerCase()
  const isVA = m.type?.toUpperCase() === 'VA' || code.startsWith('va_')
  const fixedFee = isVA || m.type?.toUpperCase() === 'RETAIL' || code.endsWith('_otc')
  const feeFixed = fixedFee ? (m.fee_fixed ?? 0) : 0
  return {
    id: m.id,
    name: m.full_name || m.name,
    icon_url: m.icon_url ?? '',
    fee_percent: fixedFee ? 0 : (m.fee_percentage ?? 0),
    fee_fixed: feeFixed,
    min_total: isVA ? 10000 + feeFixed : 0,
    max_total: 0,
    needs_phone: ['ovo', 'smartfren_airtime'].includes(code),
    available: !!m.is_active,
  }
}
