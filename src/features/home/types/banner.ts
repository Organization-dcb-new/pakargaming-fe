export type Banner = {
  id: string // UUID dari backend
  image: string // URL banner
  redirect_link: string // Link redirect saat banner diklik
}

export interface BannerResponse {
  data: Banner[]
  message: string
}
