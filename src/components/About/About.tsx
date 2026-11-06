import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '../../i18n/routing'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

/**
 * Kartu "Kenapa memilih kami" — menggantikan gambar banner pembayaran lama (bucket S3 image-dev sudah tidak ada).
 * Sengaja tanpa ikon stok: penanda kartu = nomor font display bergradient (bahasa visual brand).
 */
const REASONS = [
  { title: 'whyFastTitle', desc: 'whyFastDesc' },
  { title: 'whySecureTitle', desc: 'whySecureDesc' },
  { title: 'whyPaymentTitle', desc: 'whyPaymentDesc' },
] as const

/** Halaman Tentang Kami. Statis (tanpa fetch), dipakai oleh app/[locale]/about/page.tsx. */
export default function About() {
  const t = useTranslations('About')

  return (
    <div className="mx-auto w-full max-w-7xl space-y-14 px-4 py-10 sm:px-6 md:space-y-20 md:py-16 lg:px-8">
      <section
        aria-labelledby="about-title"
        className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_20rem] lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16"
      >
        <div className="space-y-5">
          <span className="chamfer inline-flex items-center bg-brand/15 px-3 py-1 font-display text-xs font-bold uppercase tracking-widest text-brand [--chamfer:6px]">
            {t('badge')}
          </span>
          <h1
            id="about-title"
            className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            {t('title')}
          </h1>
          <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>{t('intro1')}</p>
            <p>{t('intro2')}</p>
          </div>
        </div>

        {/* Panel logo: border gradient lewat 2 lapis chamfer (clip-path ikut memotong border biasa) + glow statis */}
        <div className="relative isolate mx-auto w-full max-w-72 md:max-w-none">
          <div aria-hidden className="absolute inset-8 -z-10 bg-gradient-brand opacity-30 blur-3xl" />
          <div className="chamfer bg-gradient-brand p-px [--chamfer:20px]">
            <div className="chamfer bg-card p-8 [--chamfer:19.5px] sm:p-10">
              <Image
                src="/logo.png"
                alt={t('altLogo')}
                width={400}
                height={400}
                priority
                sizes="(min-width: 1024px) 20rem, (min-width: 768px) 16rem, 14rem"
                className="mx-auto h-auto w-full max-w-64"
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="about-why-title" className="space-y-8">
        <div className="max-w-2xl space-y-3">
          <h2
            id="about-why-title"
            className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {t('whyTitle')}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">{t('whyP2')}</p>
        </div>

        <ul className="grid gap-4 md:grid-cols-3">
          {REASONS.map(({ title, desc }, i) => (
            <li key={title} className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <span
                aria-hidden
                className="text-gradient-brand inline-block font-display text-4xl font-bold leading-none tabular-nums"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span aria-hidden className="mt-4 block h-px w-10 bg-gradient-brand" />
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{t(title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(desc)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="about-catalog-title"
        className="relative overflow-hidden rounded-xl border border-border bg-card"
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-brand" />
        <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="space-y-2">
            <h2
              id="about-catalog-title"
              className="font-display text-2xl font-bold tracking-tight text-foreground"
            >
              {t('catalogTitle')}
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              {t('catalogDesc')}
            </p>
          </div>

          <Link
            href="/games"
            className={`chamfer flex h-12 shrink-0 items-center justify-center gap-2 rounded-sm bg-primary px-7 text-base font-bold text-primary-foreground transition-colors duration-200 hover:bg-primary/85 motion-reduce:transition-none ${focusRing}`}
          >
            {t('catalogCta')}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  )
}
