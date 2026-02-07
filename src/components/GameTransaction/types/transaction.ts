export interface CreateOrderRequest {
  email: string
  game_data: Record<string, any>
  package: {
    product_id: string
    product_name: string
    product_sku: string
  }
  payment: {
    payment_method_id: string
    payment_channel: string
  }
  provider_id: string
  game_id: string
  product_id: string
}
