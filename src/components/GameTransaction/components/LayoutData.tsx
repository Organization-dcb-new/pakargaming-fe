import { ReactNode } from 'react'

export default function LayoutData({ children }: { children: ReactNode }) {
  return <div className="min-h-screen flex flex-col xl:flex-row gap-5 justify-center px-5 mt-5">{children}</div>
}
