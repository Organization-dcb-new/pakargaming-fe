import type { ReactNode } from 'react'
import { CalendarDays } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { useLocale, useTranslations } from 'next-intl'
import { FOOTER_CONTACT } from '../Footer/config'
import LegalToc, { type LegalTocItem } from './LegalToc'
import { padNumber, slugify } from './utils'

export type LegalListItem = string | { term: string; desc: string }

export type LegalBlock =
  | { kind: 'text'; text: string }
  | { kind: 'list'; items: LegalListItem[] }
  | { kind: 'chips'; items: string[] }
  | { kind: 'subsection'; heading: string; blocks: LegalBlock[] }

export interface LegalSection {
  title: string
  blocks: LegalBlock[]
}

interface LegalDocumentProps {
  eyebrow?: string
  title: string
  intro: string
  /** Tanggal ISO `YYYY-MM-DD` — diformat sesuai locale aktif (rules §8) */
  lastUpdated: string
  sections: LegalSection[]
}

const CONTACT_ID = 'kontak'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card'

const proseClass = 'text-sm leading-relaxed text-muted-foreground sm:text-base'

const contactCardClass = `flex flex-1 items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 transition-colors duration-200 hover:border-primary/50 motion-reduce:transition-none ${focusRing}`

function BlockView({ block }: { block: LegalBlock }) {
  if (block.kind === 'text') {
    return <p className={proseClass}>{block.text}</p>
  }

  if (block.kind === 'chips') {
    return (
      <ul className="flex flex-wrap gap-2">
        {block.items.map((item) => (
          <li
            key={item}
            className="chamfer inline-flex items-center bg-muted px-3 py-1.5 text-xs font-semibold text-foreground [--chamfer:6px]"
          >
            {item}
          </li>
        ))}
      </ul>
    )
  }

  if (block.kind === 'subsection') {
    return (
      <div className="space-y-2 border-l-2 border-brand/40 pl-4">
        <h3 className="text-sm font-semibold text-foreground sm:text-base">{block.heading}</h3>
        {block.blocks.map((child, i) => (
          <BlockView key={i} block={child} />
        ))}
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {block.items.map((item, i) => (
        <li key={i} className={`flex gap-3 ${proseClass}`}>
          <span aria-hidden className="mt-2 size-1.5 shrink-0 rotate-45 bg-primary sm:mt-2.5" />
          <span>
            {typeof item === 'string' ? (
              item
            ) : (
              <>
                <strong className="font-semibold text-foreground">{item.term}:</strong> {item.desc}
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** Satu bagian bernomor: badge chamfer ungu (sama dengan StepCard) + judul font display. */
function DocSection({
  id,
  number,
  title,
  children,
}: {
  id: string
  number: number
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 p-5 sm:p-7 md:scroll-mt-24">
      <div className="flex items-start gap-3 sm:gap-4">
        <span
          aria-hidden
          className="chamfer flex size-8 shrink-0 items-center justify-center bg-brand-solid font-display text-sm font-bold tabular-nums text-brand-solid-foreground [--chamfer:7px]"
        >
          {padNumber(number)}
        </span>
        <h2
          id={`${id}-title`}
          className="min-w-0 font-display text-lg font-semibold leading-8 text-foreground sm:text-xl"
        >
          {title}
        </h2>
      </div>
      {/* Mobile: isi selebar kartu. sm+: menjorok sejajar judul (badge 2rem + gap 1rem) */}
      <div className="mt-3 space-y-3 sm:pl-12">{children}</div>
    </section>
  )
}

/** Template halaman legal (S&K, Kebijakan Privasi): header + daftar isi + dokumen bernomor + kontak. */
export default function LegalDocument({ eyebrow, title, intro, lastUpdated, sections }: LegalDocumentProps) {
  const t = useTranslations('Legal')
  const locale = useLocale()

  const updatedLabel = new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(`${lastUpdated}T00:00:00+07:00`))

  const tocItems: LegalTocItem[] = [
    ...sections.map((section, i) => ({ id: slugify(section.title), number: i + 1, title: section.title })),
    { id: CONTACT_ID, number: sections.length + 1, title: t('contactTitle') },
  ]

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <span className="chamfer inline-flex items-center bg-brand/15 px-3 py-1 font-display text-xs font-bold uppercase tracking-widest text-brand [--chamfer:6px]">
            {eyebrow ?? t('eyebrow')}
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">{intro}</p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4 shrink-0" aria-hidden />
            {t('lastUpdated', { date: updatedLabel })}
          </p>
          {/* Isi pasal hanya tersedia dalam Bahasa Indonesia — beri tahu pembaca locale lain */}
          {locale !== 'id' && (
            <p className="mt-4 rounded-lg border border-info/30 bg-info/10 px-3 py-2 text-sm text-foreground">
              {t('contentLanguageNote')}
            </p>
          )}
        </header>

        <div className="mt-8 grid gap-6 md:mt-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-start lg:gap-10">
          <LegalToc items={tocItems} />

          <article className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {sections.map((section, i) => (
              <DocSection key={tocItems[i].id} id={tocItems[i].id} number={i + 1} title={section.title}>
                {section.blocks.map((block, bi) => (
                  <BlockView key={bi} block={block} />
                ))}
              </DocSection>
            ))}

            <DocSection id={CONTACT_ID} number={sections.length + 1} title={t('contactTitle')}>
              <p className={proseClass}>{t('contactDesc')}</p>
              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <a href={FOOTER_CONTACT.emailUrl} className={contactCardClass}>
                  {/* Email tidak punya logo brand — pakai glyph "@" font display, bukan ikon stok */}
                  <span
                    aria-hidden
                    className="chamfer flex size-10 shrink-0 items-center justify-center bg-primary/10 pb-0.5 font-display text-xl font-bold leading-none text-primary [--chamfer:7px]"
                  >
                    @
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-xs text-muted-foreground">{t('email')}</span>
                    <span className="truncate text-sm font-semibold text-foreground">
                      {FOOTER_CONTACT.email}
                    </span>
                  </span>
                </a>

                <a
                  href={FOOTER_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={contactCardClass}
                >
                  <span
                    aria-hidden
                    className="chamfer flex size-10 shrink-0 items-center justify-center bg-whatsapp/10 text-whatsapp [--chamfer:7px]"
                  >
                    <FaWhatsapp className="size-5" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-xs text-muted-foreground">{t('whatsapp')}</span>
                    <span className="truncate text-sm font-semibold text-foreground">
                      {FOOTER_CONTACT.whatsappDisplay}
                    </span>
                  </span>
                  <span className="sr-only">{t('opensInNewTab')}</span>
                </a>
              </div>
            </DocSection>
          </article>
        </div>
      </div>
    </div>
  )
}
