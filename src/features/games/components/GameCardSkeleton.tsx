export function GameCardSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 animate-pulse"
        >
          {/* Thumbnail */}
          <div className="aspect-[16/9] bg-gray-200 dark:bg-white/10" />

          {/* Content */}
          <div className="p-5 space-y-3">
            <div className="h-4 w-20 rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-white/10" />
          </div>
        </div>
      ))}
    </>
  )
}
