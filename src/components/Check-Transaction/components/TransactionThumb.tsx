'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getInitials } from '../../../utils/initials'

interface TransactionThumbProps {
  src?: string | null
  name?: string | null
  size?: 'md' | 'lg'
}

/** Thumbnail game/produk di daftar transaksi, dengan fallback inisial saat gambar kosong/gagal. */
export default function TransactionThumb({ src, name, size = 'md' }: TransactionThumbProps) {
  const [failed, setFailed] = useState(false)
  const box = size === 'lg' ? 'h-12 w-12 rounded-xl' : 'h-10 w-10 rounded-lg'

  return (
    <span className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-muted ${box}`}>
      {src && !failed ? (
        <Image
          src={src}
          alt=""
          fill
          unoptimized
          sizes="48px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden className="bg-stripes flex h-full w-full items-center justify-center font-display text-xs font-bold text-muted-foreground">
          {getInitials(name || '?')}
        </span>
      )}
    </span>
  )
}
