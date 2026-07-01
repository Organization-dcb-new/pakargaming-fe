import { ReactNode } from 'react'

export default function LayoutFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="mt-16 border-t border-border/70 bg-muted/30 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="mx-auto w-full max-w-6xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-12 sm:px-6 lg:px-8 lg:pt-16">
        {children}
      </div>
    </footer>
  )
}
