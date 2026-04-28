import { ReactNode } from 'react'

export default function LayoutBottom({ children }: { children: ReactNode }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-purple-500/25 bg-white/95 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-2 shadow-[0_-4px_24px_-8px_rgba(88,28,135,0.12)] backdrop-blur-md dark:border-purple-500/20 dark:bg-slate-900/95 dark:shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.35)] supports-[backdrop-filter]:bg-white/85 dark:supports-[backdrop-filter]:bg-slate-900/90 md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-center gap-2 px-3 min-[400px]:px-4">
        {children}
      </div>
    </div>
  )
}
