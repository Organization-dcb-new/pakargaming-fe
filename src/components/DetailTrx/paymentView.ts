import { PaymentDataWithDetailProduct } from '../../types/Transaction'

/**
 * Menentukan instruksi bayar yang ditampilkan untuk transaksi PENDING berdasarkan channel.
 * Aturannya dipindah apa adanya dari StatusTrx lama (renderPendingActions) — hanya presentasi,
 * tidak ada perubahan data/logika backend.
 */

const EWALLET_CHANNELS = new Set(['shopeepay', 'gopay', 'dana', 'ovo'])

function isImageLikeUrl(s: string | undefined): boolean {
  if (!s?.trim()) return false
  const u = s.trim().toLowerCase()
  return u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:image/')
}

export function isHttpUrl(s: string | undefined | null): boolean {
  if (!s?.trim()) return false
  const u = s.trim().toLowerCase()
  return u.startsWith('http://') || u.startsWith('https://')
}

/** none = tidak ada instruksi; carrier = pulsa (OTP SMS); otc = bayar di kasir; standard = QR/VA/e-wallet/link */
export type PaymentViewKind = 'none' | 'carrier' | 'otc' | 'standard'

export function getPaymentView(data: PaymentDataWithDetailProduct) {
  const channel = data.payment_channel?.toLowerCase() ?? ''
  const vaNumber = data.va_number?.trim() ?? ''

  const qrImageSrc =
    (isImageLikeUrl(data.qr_code_url) ? data.qr_code_url : null) ||
    (isImageLikeUrl(data.qr_string) ? data.qr_string : null)

  const rawQrString =
    data.qr_string?.trim() && !isImageLikeUrl(data.qr_string) && !qrImageSrc
      ? data.qr_string.trim()
      : ''

  const isVaChannel = channel.startsWith('va_')
  const isOvo = channel === 'ovo'
  const isOtc = channel === 'alfamart_otc' || channel === 'indomaret_otc'
  const carrierOnly = channel.includes('smartfren_airtime') && !isVaChannel
  const otcCode = vaNumber || data.payment_number?.trim() || ''
  const hasPaymentLink = !!data.payment_url?.trim()

  let kind: PaymentViewKind = 'standard'
  if (!qrImageSrc && !rawQrString && !vaNumber && !carrierOnly && !hasPaymentLink) kind = 'none'
  else if (carrierOnly) kind = 'carrier'
  else if (isOtc && otcCode) kind = 'otc'

  return {
    kind,
    channel,
    vaNumber,
    qrImageSrc,
    rawQrString,
    isVaChannel,
    isEwallet: EWALLET_CHANNELS.has(channel),
    isOvo,
    isQris: channel.includes('qris'),
    otcOutlet: channel === 'indomaret_otc' ? 'Indomaret' : 'Alfamart',
    otcCode,
    hasPaymentLink,
    /** Tombol "Lanjutkan Pembayaran": tidak untuk pulsa, dan OVO cukup lewat aplikasinya */
    showPaymentLink: hasPaymentLink && kind !== 'carrier' && (kind === 'otc' || !isOvo),
  }
}

export type PaymentView = ReturnType<typeof getPaymentView>
