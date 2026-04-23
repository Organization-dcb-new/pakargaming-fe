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
      {visibleNavLinks.map(({ path, label }) => (
        <Link
          key={path}
          href={path}
          className={`
        px-3 py-2
        rounded-full
        text-sm font-medium
        transition
        ${
          pathname === path
            ? 'bg-purple-600 text-white'
            : 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-600/40 dark:text-white dark:hover:bg-purple-700/60'
        }
      `}
        >
          {label}
        </Link>
      ))}
    </>
  )
}
