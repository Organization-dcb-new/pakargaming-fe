import { House, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '../../i18n/routing'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

/** Halaman 404 "Game Over". Statis (tanpa fetch), dipakai oleh app/[locale]/not-found.tsx. */
export default function NotFound() {
  const t = useTranslations('NotFound')

  return (
    <section
      aria-labelledby="not-found-title"
      className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6 md:py-24 lg:px-8"
    >
      <span className="chamfer inline-flex items-center bg-destructive/15 px-3 py-1 font-display text-xs font-bold uppercase tracking-widest text-destructive [--chamfer:6px]">
        {t('badge')}
      </span>

      {/* Angka dekoratif: makna halaman disampaikan oleh h1 di bawah */}
      <p
        aria-hidden="true"
        className="text-gradient-brand mt-4 select-none font-display text-8xl leading-none font-bold tracking-tight sm:text-9xl md:text-[10rem]"
      >
        404
      </p>

      <h1
        id="not-found-title"
        className="mt-6 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
      >
        {t('title')}
      </h1>
      <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">
        {t('description')}
      </p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link
          href="/"
          className={`chamfer flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-7 text-base font-bold text-primary-foreground transition-colors duration-200 hover:bg-primary/85 motion-reduce:transition-none ${focusRing}`}
        >
          <House className="size-4" aria-hidden="true" />
          {t('ctaHome')}
        </Link>
        <Link
          href="/check-transaction"
          className={`flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-card px-7 text-base font-semibold text-foreground transition-colors duration-200 hover:border-primary/50 hover:text-primary motion-reduce:transition-none ${focusRing}`}
        >
          <Search className="size-4" aria-hidden="true" />
          {t('ctaCheckTransaction')}
        </Link>
      </div>
    </section>
  )
}
