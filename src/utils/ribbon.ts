import { Show } from "../../types/Show"

export function getRibbon(show: Show) {
  if (show.IsPopular) {
    return {
      label: 'POPULAR',
      className: 'from-pink-500 to-purple-600',
    }
  }

  if (show.IsNew) {
    return {
      label: 'NEW',
      className: 'from-emerald-500 to-green-600',
    }
  }

  if (show.IsHot) {
    return {
      label: 'HOT',
      className: 'from-orange-500 to-red-600',
    }
  }

  return null
}