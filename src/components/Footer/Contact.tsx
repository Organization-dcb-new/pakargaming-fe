'use client'

import { Mail, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ContactComponent() {
  const t = useTranslations('Footer')

  return (
    <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none">
      <h3 className="text-sm font-semibold tracking-wide text-foreground">{t('contact')}</h3>

      <ul className="space-y-3">
        <li>
          <a
            href="https://wa.me/628131793708"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-sm font-medium text-muted-foreground transition-colors hover:text-purple-600 dark:hover:text-purple-400"
          >
            <Phone className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" aria-hidden />
            <span className="break-all">+62 813-1793-708</span>
          </a>
        </li>

        <li>
          <a
            href="mailto:pakargaming1@gmail.com"
            className="group inline-flex items-center gap-3 text-sm font-medium text-muted-foreground transition-colors hover:text-purple-600 dark:hover:text-purple-400"
          >
            <Mail className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" aria-hidden />
            <span className="break-all">pakargaming1@gmail.com</span>
          </a>
        </li>
      </ul>
    </div>
  )
}
