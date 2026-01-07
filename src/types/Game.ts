import { Category } from "./Category";
import { ApiResponse } from "./Global";

export interface Game {
  id: string;
  category_id: string;
  provider_id: string;
  name: string;
  slug: string;
  code: string;
  thumbnail_url: string;
  banner_url: string;
  description: string;
  instruction: string;
  developer: string;
  publisher: string;
  is_featured: boolean;
  is_active: boolean;
  popularity_score: number;
  created_at: string;
  updated_at: string;
  category: Category;
}

export interface GameInput {
  id: string;
  game_id: string;
  key: string;
  label: string;
  input_type: "text" | "number" | string;
  required: boolean;
  sort_order: number;
  placeholder: string;
}

export interface Price {
  id: string;
  image: string;
  sku: string;
  name: string;
  selling_price: number;
}
export interface GamDetail {
  id: string;
  category_id: string;
  provider_id: string;
  game_id: string;
  name: string;
  slug: string;
  code: string;
  thumbnail_url: string;
  banner_url: string;
  description: string;
  instruction: string;
  developer: string;
  publisher: string;
  is_featured: boolean;
  is_active: boolean;
  is_check_id: boolean;
  popularity_score: number;
  created_at: string;
  updated_at: string;
  category: Category;
  input: GameInput[];
  product: Price[];
}

export type GetGamesResponse = ApiResponse<Game[]>;
export type GetGameResponse = ApiResponse<GamDetail>;
