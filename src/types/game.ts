import { ApiResponse } from './api'

export interface Game {
  id: string
  provider_id: string
  name: string
  slug: string
  code: string
  thumbnail_url: string
  banner_url: string
  description: string
  instruction: string
  developer: string
  publisher: string
  is_featured: boolean
  is_show: boolean
  is_active: boolean
  popularity_score: number
  created_at: string
  updated_at: string
}

export interface GameInputOption {
  name: string
  value: string
}
export interface GameInput {
  id: string
  game_id: string
  key: string
  label: string
  input_type: GameInputType
  required: boolean
  sort_order: number
  placeholder: string
  Options: GameInputOption[] | null
}

export type GameInputType =
  | 'text'
  | 'number'
  | 'tel'
  | 'email'
  | 'password'
  | 'dropdown'
  | 'date'
  | 'textarea'

export interface Price {
  id: string
  image: string
  sku: string
  name: string
  selling_price: number
}

export interface GameDetail {
  id: string
  provider_id: string
  game_id: string
  name: string
  slug: string
  code: string
  thumbnail_url: string
  banner_url: string
  description: string
  instruction: string
  developer: string
  publisher: string
  is_featured: boolean
  is_active: boolean
  is_check_id: boolean
  popularity_score: number
  created_at: string
  updated_at: string
  input: GameInput[]
  product: Price[]
  /** Region akun yang dilayani game ini (id, my, …). */
  region: string
  /** Halaman game ini di tiap region yang tampil, termasuk dirinya; region toko duluan. Bisa null dari cache lama. */
  regions?: GameRegionLink[] | null
}

export interface GameRegionLink {
  region: string
  slug: string
  status: string
}

/** Negara di pemilih region navbar: yang punya game tampil, region toko duluan. */
export interface StoreRegion {
  code: string
  /** Nama Inggris dari backend; tampilan pakai `regionName` sesuai bahasa aktif. */
  name: string
  game_count: number
}

export interface SearchGame {
  id: string
  name: string
  slug: string
  thumbnail_url: string
}


export type GetGamesResponse = ApiResponse<Game[]>
export type GetGameResponse = ApiResponse<GameDetail>
export type GetGamesBySearchResponse = ApiResponse<SearchGame[]>
export type GetStoreRegionsResponse = ApiResponse<StoreRegion[]>
