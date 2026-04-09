import type { Show } from '@/types/Show'

export function getRibbon(show: Show) {
  if (show.is_popular) {
    return {
      label: 'POPULAR',
      className: 'from-pink-500 to-purple-600',
    }
  }

  if (show.is_new) {
    return {
      label: 'NEW',
      className: 'from-emerald-500 to-green-600',
    }
  }

  if (show.is_hot) {
    return {
      label: 'HOT',
      className: 'from-orange-500 to-red-600',
    }
  }

  return null
}