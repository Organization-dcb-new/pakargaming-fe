import { ReactNode } from 'react'

export default function LayoutBottom({ children }: { children: ReactNode }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand/20 bg-background/95 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-2 shadow-[0_-4px_20px_-8px_rgb(0_0_0/0.18)] backdrop-blur-md supports-[backdrop-filter]:bg-background/85 md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-center gap-2 px-3 min-[400px]:px-4">
        {children}
      </div>
    </div>
  )
}
