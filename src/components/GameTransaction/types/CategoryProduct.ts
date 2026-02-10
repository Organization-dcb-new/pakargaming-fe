import { Price } from "../../../types/Game"


export type CategoryProduct = {
  id: string
  name: string
  game_id: string
  game_name: string
  slug: string
  icon_url: string
  description: string
  is_active: boolean
  product: Price[]
}

export type CategoryProductListResponse = {
  status: string
  message: string
  data: CategoryProduct[]
}
