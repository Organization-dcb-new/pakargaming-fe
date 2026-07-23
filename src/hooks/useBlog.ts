import { useQuery } from '@tanstack/react-query'
import { api } from '../api/axios'

export interface BlogItem {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  category?: string
  tags?: string[]
  cover_image?: string
  author_id?: string
  author_name?: string
  published_at?: string
  created_at?: string
  read_time?: string
}

export interface BlogListResponse {
  status: boolean
  message: string
  data: BlogItem[]
  meta?: {
    page: number
    limit: number
    total_items: number
    total_pages: number
  }
}

export interface BlogSingleResponse {
  status: boolean
  message: string
  data: BlogItem
}

export const useGetPublicBlogs = (page = 1, limit = 3, category?: string) =>
  useQuery<BlogListResponse>({
    queryKey: ['blogs', 'public', page, limit, category ?? 'all'],
    queryFn: async () => {
      const res = await api.get('/v1/blogs', {
        params: {
          page,
          limit,
          ...(category ? { category } : {}),
        },
      })
      return res.data
    },
  })

export const useGetBlogById = (id: string) =>
  useQuery<BlogSingleResponse>({
    queryKey: ['blog', 'id', id],
    queryFn: async () => {
      const res = await api.get(`/v1/blogs/single/${id}`)
      return res.data
    },
    enabled: !!id,
  })
