export function GamesByShowSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20 animate-pulse">
      {/* LOOP SKELETON SHOW (misal 2 section) */}
      {[...Array(1)].map((_, i) => (
        <div key={i}>
          {/* HEADER */}
          <div className="mb-8">
            <div className="h-7 w-48 rounded-md bg-gray-200 dark:bg-white/10" />
          </div>

          {/* GAMES */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, j) => (
              <div
                key={j}
                className="relative rounded-2xl overflow-hidden
                bg-gray-200 dark:bg-white/10
                h-44"
              >
                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
