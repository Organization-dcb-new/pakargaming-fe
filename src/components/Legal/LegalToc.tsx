'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { padNumber } from './utils'

export interface LegalTocItem {
  id: string
  number: number
  title: string
}

/**
 * Daftar isi dokumen legal. Desktop (lg+): sticky di samping konten, bagian aktif di-highlight.
 * Mobile/tablet: <details> yang bisa dibuka-tutup, otomatis tertutup setelah memilih bagian.
 */
export default function LegalToc({ items }: { items: LegalTocItem[] }) {
  const t = useTranslations('Legal')
  const [activeId, setActiveId] = useState(items[0]?.id)
  const detailsRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const visible = new Set<string>()
    // Bagian aktif = bagian teratas yang berada di pita 96px (di bawah navbar sticky) s/d 35% tinggi viewport
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        const first = items.find((item) => visible.has(item.id))
        if (first) setActiveId(first.id)
      },
      { rootMargin: '-96px 0px -65% 0px' },
    )

    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [items])

  const handleSelect = (id: string) => {
    setActiveId(id)
    detailsRef.current?.removeAttribute('open')
  }

  const list = (
    <ol className="space-y-0.5">
      {items.map((item) => {
        const active = item.id === activeId
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={() => handleSelect(item.id)}
              aria-current={active ? 'location' : undefined}
              className={`flex gap-2.5 rounded-r-md border-l-2 px-3 py-1.5 text-sm leading-snug transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring motion-reduce:transition-none ${
                active
                  ? 'border-primary bg-primary/10 font-semibold text-foreground'
                  : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className={`w-5 shrink-0 font-display tabular-nums ${active ? 'text-primary' : ''}`}>
                {padNumber(item.number)}
              </span>
              <span className="min-w-0">{item.title}</span>
            </a>
          </li>
        )
      })}
    </ol>
  )

  return (
    <>
      <details ref={detailsRef} className="group rounded-xl border border-border bg-card lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 font-display text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
          <span>{t('tocToggle', { count: items.length })}</span>
          <ChevronDown
            className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
            aria-hidden
          />
        </summary>
        <nav aria-label={t('tocTitle')} className="border-t border-border p-2">
          {list}
        </nav>
      </details>

      <nav
        aria-label={t('tocTitle')}
        className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto"
      >
        <p className="mb-3 px-3 font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {t('tocTitle')}
        </p>
        {list}
      </nav>
    </>
  )
}
