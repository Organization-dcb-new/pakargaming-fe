import { Link } from '../../i18n/routing'
import { NavLink } from './Desktop'
import { usePathname } from '../../i18n/routing'

interface MobileBottomProps {
  visibleNavLinks: NavLink[]
}

export default function MobileBottomNav({ visibleNavLinks }: MobileBottomProps) {
  const pathname = usePathname()

  return (
    <>
      {visibleNavLinks.map(({ path, label }) => {
        const active = pathname === path
        return (
          <Link
            key={path}
            href={path}
            aria-current={active ? 'page' : undefined}
            className={`inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              active
                ? 'bg-brand text-brand-foreground shadow-md shadow-brand/25'
                : 'bg-brand/10 text-brand hover:bg-brand/20'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </>
  )
}
