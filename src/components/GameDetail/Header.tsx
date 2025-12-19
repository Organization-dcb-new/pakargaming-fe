import Image from 'next/image'
import { GetGameResponse } from '../../types/Game'

interface HeaderProps {
  GameDetail: GetGameResponse
}

export default function HeaderGameDetail({ GameDetail }: HeaderProps) {
  return (
    <div
      className="
  dark:bg-white/10
  bg-black/5
  backdrop-blur-lg
  flex items-center
  rounded-3xl
  px-6 py-5 mb-6
  border border-white/20 dark:border-white/20
  shadow-xl
  min-h-[120px] max-h-32
"
    >
      <div className="flex items-center gap-5 w-full">
        {/* Icon / Thumbnail */}
        <div
          className="
      relative w-20 h-20 shrink-0
      bg-gradient-to-br from-pink-500 to-purple-600
      rounded-2xl shadow-md overflow-hidden
    "
        >
          {GameDetail?.data?.thumbnail_url && (
            <Image
              src={GameDetail.data.thumbnail_url}
              alt={GameDetail.data.name ?? 'Game Thumbnail'}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h1
            className="
        text-xl font-bold
        text-gray-900 dark:text-white
        leading-tight truncate
      "
          >
            {GameDetail?.data?.name}
          </h1>

          <p
            className="
        text-sm leading-snug line-clamp-2 mt-1
        text-gray-600 dark:text-purple-200
      "
          >
            Top up items {GameDetail?.data?.name} hanya dalam hitungan detik!
          </p>

          <div className="flex gap-2 mt-3">
            <span
              className="
          inline-flex items-center
          bg-green-500/20
          text-green-700 dark:text-green-300
          px-2.5 py-1 rounded-full
          text-xs font-medium
          border border-green-500/30
        "
            >
              ✓ Aman
            </span>

            <span
              className="
          inline-flex items-center
          bg-blue-500/20
          text-blue-700 dark:text-blue-300
          px-2.5 py-1 rounded-full
          text-xs font-medium
          border border-blue-500/30
        "
            >
              ✓ Instan
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
