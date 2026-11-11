import { ReactNode } from 'react'

/**
 * Bingkai banner HUD: sudut terpotong (chamfer) dengan garis tepi gradient brand. Garis dibuat dua lapis
 * (luar = gradient, dalam = konten) karena clip-path ikut memotong border biasa; bayangan memakai
 * drop-shadow di pembungkus luar karena box-shadow ikut terpotong. Container & spacing diatur HomePage.
 */
export default function BannerFrame({ children }: { children: ReactNode }) {
  return (
    <div className="[filter:drop-shadow(0_16px_28px_color-mix(in_oklab,var(--brand)_30%,transparent))]">
      <div className="chamfer bg-gradient-brand p-0.5 [--chamfer:14px] sm:[--chamfer:22px]">
        <div className="chamfer relative isolate overflow-hidden bg-card [--chamfer:13px] sm:[--chamfer:21px]">
          {children}
        </div>
      </div>
    </div>
  )
}
