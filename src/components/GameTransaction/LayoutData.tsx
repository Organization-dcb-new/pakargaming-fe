import { ReactNode } from 'react'

export default function LayoutData({ children }: { children: ReactNode }) {
  return <div className="min-h-screen flex flex-row justify-center px-5 border-2 border-black">{children}</div>
}
