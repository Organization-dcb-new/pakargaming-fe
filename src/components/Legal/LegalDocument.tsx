import { Mail } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { FOOTER_CONTACT } from '../Footer/config'

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
  lastUpdated: string
  sections: LegalSection[]
}

const badgeClass =
  'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-sm font-semibold text-purple-700 dark:bg-purple-500/15 dark:text-purple-300'
const headingClass = 'text-lg font-semibold text-foreground'
const proseClass = 'text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]'

function BlockView({ block }: { block: LegalBlock }) {
  if (block.kind === 'text') {
    return <p className={proseClass}>{block.text}</p>
  }

  if (block.kind === 'chips') {
    return (
      <div className="flex flex-wrap gap-2">
        {block.items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground dark:bg-white/5"
          >
            {item}
          </span>
        ))}
      </div>
    )
  }

  if (block.kind === 'subsection') {
    return (
      <div className="space-y-2 border-l-2 border-purple-200 pl-4 dark:border-purple-500/25">
        <h3 className="text-sm font-semibold text-foreground">{block.heading}</h3>
        {block.blocks.map((child, i) => (
          <BlockView key={i} block={child} />
        ))}
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {block.items.map((item, i) => (
        <li key={i} className={`flex gap-2.5 ${proseClass}`}>
          <span
            className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500/70 dark:bg-purple-400/70"
            aria-hidden
          />
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

export default function LegalDocument({
  eyebrow = 'Dokumen Legal',
  title,
  intro,
  lastUpdated,
  sections,
}: LegalDocumentProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <header className="mb-10 text-center">
        <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300">
          {eyebrow}
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {intro}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">Terakhir diperbarui: {lastUpdated}</p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="divide-y divide-border">
          {sections.map((section, i) => (
            <section key={section.title} className="p-6 sm:p-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <span className={badgeClass}>{i + 1}</span>
                <div className="flex-1 space-y-3">
                  <h2 className={headingClass}>{section.title}</h2>
                  {section.blocks.map((block, bi) => (
                    <BlockView key={bi} block={block} />
                  ))}
                </div>
              </div>
            </section>
          ))}

          <section className="p-6 sm:p-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <span className={badgeClass}>{sections.length + 1}</span>
              <div className="flex-1 space-y-4">
                <h2 className={headingClass}>Kontak PakarGaming</h2>
                <p className={proseClass}>
                  Ada pertanyaan seputar dokumen ini? Silakan hubungi kami melalui kanal resmi
                  berikut.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={FOOTER_CONTACT.emailUrl}
                    className="group inline-flex flex-1 items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 transition-colors hover:border-purple-300 hover:bg-purple-50/60 dark:bg-white/5 dark:hover:border-purple-500/30 dark:hover:bg-purple-500/10"
                  >
                    <Mail className="h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" aria-hidden />
                    <span className="flex min-w-0 flex-col">
                      <span className="text-xs text-muted-foreground">Email</span>
                      <span className="truncate text-sm font-medium text-foreground">
                        {FOOTER_CONTACT.email}
                      </span>
                    </span>
                  </a>

                  <a
                    href={FOOTER_CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex flex-1 items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 transition-colors hover:border-purple-300 hover:bg-purple-50/60 dark:bg-white/5 dark:hover:border-purple-500/30 dark:hover:bg-purple-500/10"
                  >
                    <FaWhatsapp className="h-5 w-5 shrink-0 text-green-600" aria-hidden />
                    <span className="flex min-w-0 flex-col">
                      <span className="text-xs text-muted-foreground">WhatsApp</span>
                      <span className="truncate text-sm font-medium text-foreground">
                        {FOOTER_CONTACT.whatsappDisplay}
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
