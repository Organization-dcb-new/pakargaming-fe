import { normalizeTransactionStatus } from '@/components/ui/status-badge'

/**
 * Nasib pesanan yang sudah dibayar (review SF1, 18 Nov 2026). Dulu halaman langsung menulis
 * "Transaksi berhasil" begitu pembayaran PAID, padahal supplier bisa saja gagal mengirim atau dananya
 * dikembalikan. Backend sekarang mengirim `order_status`:
 * - completed: supplier sudah mengirim (COMPLETED), atau backend lama yang belum mengirim order_status;
 * - processing: dibayar, masih dikirim ke akun pembeli (PAID, PROCESSING);
 * - delayed: dibayar, tapi supplier belum menerima pesanannya (FULFILMENT_FAILED), ditangani tim;
 * - refunded: pesanan dibatalkan dan dana dikembalikan.
 */
export type OrderProgress = 'completed' | 'processing' | 'delayed' | 'refunded'

type StatusFields = { status?: string | null; order_status?: string | null }

/** null: pembayaran belum lunas atau gagal (belum ada pesanan yang perlu dilaporkan). */
export function orderProgress(data: StatusFields): OrderProgress | null {
  const payment = (data.status || '').toUpperCase()
  const order = (data.order_status || '').toUpperCase()
  if (payment === 'REFUNDED' || order === 'REFUNDED') return 'refunded'
  if (normalizeTransactionStatus(data.status) !== 'paid') return null
  switch (order) {
    case '':
    case 'COMPLETED':
      return 'completed'
    case 'FULFILMENT_FAILED':
    case 'FAILED':
      return 'delayed'
    default:
      return 'processing'
  }
}

/**
 * Status untuk warna dan badge (berhasil / menunggu / gagal) yang memperhitungkan pesanan: dibayar
 * tapi belum terkirim tampil kuning, dikembalikan tampil merah.
 */
export function displayStatus(data: StatusFields): string {
  switch (orderProgress(data)) {
    case 'processing':
    case 'delayed':
      return 'PENDING'
    case 'refunded':
      return 'FAILED'
    default:
      return data.status || ''
  }
}
