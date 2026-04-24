import { ReactNode } from 'react'

export default function LayoutFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="mt-10 border-t border-border/70 bg-muted/30 backdrop-blur-md dark:border-border/50 dark:bg-black/35 sm:mt-12">
      <div className="mx-auto w-full max-w-6xl px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">
        {children}
      </div>
    </footer>
  )
}
