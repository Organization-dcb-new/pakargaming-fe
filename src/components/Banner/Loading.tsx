import { BANNER_IMAGE_HEIGHT, BANNER_IMAGE_WIDTH } from './bannerDimensions'

export function ShowSkeleton() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-10 animate-pulse">
      <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl">
        <div
          className="w-full rounded-2xl bg-gray-200 dark:bg-white/10"
          style={{
            aspectRatio: `${BANNER_IMAGE_WIDTH} / ${BANNER_IMAGE_HEIGHT}`,
          }}
        />
      </div>
    </section>
  )
}
