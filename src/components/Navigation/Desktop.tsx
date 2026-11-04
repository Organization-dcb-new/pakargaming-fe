import { useTranslations } from 'next-intl'
import { Link, usePathname } from '../../i18n/routing'
import SearchComponent from './Search'
import { ThemeToggle } from '../ThemeToggle'
import { LanguageSwitcher } from '../LanguageSwitcher'
import UserMenu from './UserMenu'
import { NAV_ITEMS, focusRing, isNavActive } from './config'

interface DesktopNavProps {
  user: any
  loginWithGoogle: () => void
}

export default function DesktopNavigation({ user, loginWithGoogle }: DesktopNavProps) {
  const t = useTranslations('Navigation')
  const pathname = usePathname()

  return (
    <div className="hidden min-w-0 flex-1 items-center gap-4 lg:flex">
      <nav aria-label={t('mainNav')} className="flex items-center gap-1">
        {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
          const active = isNavActive(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-medium transition-colors duration-200 ${
                active
                  ? 'bg-brand/10 text-brand'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              } ${focusRing}`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {t(labelKey)}
            </Link>
          )
        })}
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <div className="w-52 xl:w-72">
          <SearchComponent variant="desktop" />
        </div>
        <LanguageSwitcher />
        <ThemeToggle />
        <div aria-hidden="true" className="mx-1 h-6 w-px bg-border" />
        <UserMenu user={user} loginWithGoogle={loginWithGoogle} />
      </div>
    </div>
  )
}
