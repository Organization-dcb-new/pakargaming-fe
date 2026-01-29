import { ReactNode } from 'react'

export default function LayoutData({ children }: { children: ReactNode }) {
  return <div className="min-h-screen flex justify-center mt-5 px-5">{children}</div>
}
