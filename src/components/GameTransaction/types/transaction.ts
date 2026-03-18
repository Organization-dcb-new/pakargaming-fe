export interface CreateOrderRequest {
  email: string;
  game_data: Record<string, any>;
  payment_method_id: string;
  product_id: string;
}
