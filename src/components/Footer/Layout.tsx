import { ReactNode } from 'react'

export default function LayoutFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="bg-white/80 mt-5 dark:bg-black/40 backdrop-blur-sm border-t border-purple-200 dark:border-purple-500/20 pt-5 ">
      <div className="w-full flex flex-col px-4 sm:px-6 lg:px-8">{children}</div>
    </footer>
  )
}
