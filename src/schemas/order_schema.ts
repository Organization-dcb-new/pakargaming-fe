import { z } from 'zod'

export const orderSchema = z.object({
  email: z.email('email wajib diisi'),

  game_data: z.record(z.string(), z.string().min(1, 'Field wajib diisi')),
  package: z.object({
    product_id: z.uuid('Pilih Top Up'),
    product_name: z.string().min(1),
    product_sku: z.string().min(1),
  }),
  payment: z.object({
    payment_method_id: z.uuid('Pilih Pembayaran'),
    payment_channel: z.string().min(1),
  }),
  amount: z.int(),
})

export type OrderFormValues = z.infer<typeof orderSchema>
