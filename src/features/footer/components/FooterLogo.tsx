'use client'

import Image from 'next/image'
import { useState } from 'react'
import { BrandMark } from '@/components/Logo'
import { canOptimize } from '@/lib/image'
import { usePublicEnv } from '@/providers/PublicEnvProvider'

/**
 * Logo footer dari env (NEXT_PUBLIC_FOOTER_LOGO_URL di .env server, lewat usePublicEnv) supaya bucket
 * dev/prod tidak tertanam di bundle. Kalau env kosong atau gambarnya gagal dimuat (mis. file di bucket
 * dihapus), pakai logo + wordmark lokal supaya tidak tampil ikon gambar rusak (rules §10).
 */
export default function FooterLogo({ alt }: { alt: string }) {
  const { footerLogoUrl } = usePublicEnv()
  const [failed, setFailed] = useState(false)

  if (!footerLogoUrl || failed) return <BrandMark />

  return (
    <Image
      alt={alt}
      src={footerLogoUrl}
      unoptimized={!canOptimize(footerLogoUrl)}
      width={192}
      height={64}
      className="h-auto w-40 object-contain sm:w-44"
      sizes="(max-width: 640px) 160px, 176px"
      onError={() => setFailed(true)}
    />
  )
}
