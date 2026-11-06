'use client'

import Image from 'next/image'
import { useState } from 'react'
import { BrandMark } from '../Navigation/Logo'
import { FOOTER_LOGO_SRC } from './config'

/**
 * Logo footer dari env (NEXT_PUBLIC_FOOTER_LOGO_URL). Kalau env kosong atau gambarnya gagal dimuat
 * (mis. file di bucket dihapus), pakai logo + wordmark lokal supaya tidak tampil ikon gambar rusak (rules §10).
 */
export default function FooterLogo({ alt }: { alt: string }) {
  const [failed, setFailed] = useState(false)

  if (!FOOTER_LOGO_SRC || failed) return <BrandMark />

  return (
    <Image
      alt={alt}
      src={FOOTER_LOGO_SRC}
      width={192}
      height={64}
      className="h-auto w-40 object-contain sm:w-44"
      sizes="(max-width: 640px) 160px, 176px"
      onError={() => setFailed(true)}
    />
  )
}
