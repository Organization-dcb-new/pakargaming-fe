export const GameDetailSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto flex flex-row gap-4 p-4 animate-pulse">
      {/* LEFT - Header */}
      
      <div className="bg-white/10 backdrop-blur-lg flex items-center rounded-3xl px-6 py-5 mb-6 border border-white/20 shadow-xl min-h-[120px] max-h-32 w-full">
        <div className="flex items-center gap-5 w-full">
          {/* Thumbnail */}
          <div className="w-20 h-20 rounded-2xl bg-white/30 shrink-0" />

          {/* Text */}
          <div className="flex-1 space-y-3">
            <div className="h-5 w-2/3 bg-white/30 rounded" />
            <div className="h-4 w-full bg-white/20 rounded" />
            <div className="flex gap-2 mt-3">
              <div className="h-6 w-16 bg-white/20 rounded-full" />
              <div className="h-6 w-16 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>
        
      </div>
      

      {/* RIGHT - Forms */}
      <div className="w-full space-y-6">
        {/* User ID */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 border border-white/20 shadow-xl">
          <div className="h-5 w-32 bg-white/30 rounded mb-3" />
          <div className="h-3 w-full bg-white/20 rounded mb-4" />
          <div className="h-11 w-full bg-white/30 rounded-2xl" />
        </div>

        {/* Package */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 border border-white/20 shadow-xl">
          <div className="h-5 w-40 bg-white/30 rounded mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl p-3 bg-white/20 space-y-3">
                <div className="h-8 w-8 bg-white/30 rounded mx-auto" />
                <div className="h-4 w-2/3 bg-white/30 rounded mx-auto" />
                <div className="h-4 w-1/2 bg-white/20 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 border border-white/20 shadow-xl">
          <div className="h-5 w-36 bg-white/30 rounded mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl p-3 bg-white/20 space-y-2">
                <div className="h-6 w-6 bg-white/30 rounded mx-auto" />
                <div className="h-3 w-full bg-white/30 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Email */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 border border-white/20 shadow-xl">
          <div className="h-5 w-24 bg-white/30 rounded mb-3" />
          <div className="h-3 w-full bg-white/20 rounded mb-4" />
          <div className="h-11 w-full bg-white/30 rounded-2xl" />
        </div>

        {/* Summary */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 border border-white/20 shadow-xl">
          <div className="h-5 w-40 bg-white/30 rounded mb-4" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-white/20 rounded" />
            <div className="h-4 w-full bg-white/20 rounded" />
            <div className="h-4 w-full bg-white/20 rounded" />
          </div>
          <div className="h-11 w-full bg-white/30 rounded-2xl mt-5" />
        </div>
      </div>
    </div>
  )
}
