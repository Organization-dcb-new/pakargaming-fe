import { Category } from "../types/Category";
import { ApiResponse } from "../types/Global";

export const categoriesResponse: ApiResponse<Category[]> = {
  status: 'success',
  message: 'Categories fetched successfully',
  data: [
    {
      id: '1',
      name: 'Action',
      slug: 'action',
      icon_url: 'https://img.icons8.com/fluency/96/sword.png',
      description: 'Fast-paced games that focus on combat and reflexes.',
      sort_order: 1,
      is_active: true,
      created_at: '2025-01-01T08:00:00Z',
      updated_at: '2025-01-01T08:00:00Z',
    },
    {
      id: '2',
      name: 'Adventure',
      slug: 'adventure',
      icon_url: 'https://img.icons8.com/fluency/96/treasure-map.png',
      description: 'Story-driven games with exploration and puzzle elements.',
      sort_order: 2,
      is_active: true,
      created_at: '2025-01-01T08:05:00Z',
      updated_at: '2025-01-01T08:05:00Z',
    },
    {
      id: '3',
      name: 'Role Playing Game',
      slug: 'rpg',
      icon_url: 'https://img.icons8.com/fluency/96/knight-helmet.png',
      description: 'Character progression, leveling, and immersive worlds.',
      sort_order: 3,
      is_active: true,
      created_at: '2025-01-01T08:10:00Z',
      updated_at: '2025-01-01T08:10:00Z',
    },
  ],
}
