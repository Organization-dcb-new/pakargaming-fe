'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'pg_announcements_dismissed'

const EMPTY: ReadonlySet<string> = new Set()

// Setiap akses localStorage dibungkus try/catch: mode privat / storage diblokir melempar error.
// Kalau gagal, penutupan tetap berlaku selama halaman terbuka, hanya tidak diingat setelah reload.

function readStored(): Set<string> {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    return new Set(Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [])
  } catch {
    return new Set()
  }
}

function writeStored(keys: ReadonlySet<string>) {
  try {
    if (keys.size === 0) window.localStorage.removeItem(STORAGE_KEY)
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...keys]))
  } catch {
    // Storage tidak tersedia — biarkan
  }
}

/**
 * Pengumuman yang sudah ditutup pengunjung ini (kunci `${id}:${updated_at}`, lihat dismissKey).
 * `ready` baru true setelah mount: storage tidak bisa dibaca di server, jadi render pertama di client
 * harus sama dengan HTML server (tanpa pengumuman) supaya tidak hydration mismatch.
 *
 * `currentKeys` = kunci semua pengumuman yang sedang tayang; kunci tersimpan yang tidak ada di situ
 * (berakhir, dihapus, atau versi lama) dibuang.
 */
export function useDismissedAnnouncements(currentKeys: readonly string[]) {
  const [dismissed, setDismissed] = useState<ReadonlySet<string> | null>(null)

  useEffect(() => {
    setDismissed(readStored())
  }, [])

  // String, bukan array: array baru di tiap render akan memicu efek terus-menerus
  const keysSignature = currentKeys.join('\n')
  const ready = dismissed !== null

  useEffect(() => {
    // Daftar kosong dilewati: bisa jadi server baru restart saat backend mati, bukan semuanya selesai
    if (!ready || !keysSignature) return
    const current = new Set(keysSignature.split('\n'))
    const stored = readStored()
    const kept = new Set([...stored].filter((key) => current.has(key)))
    if (kept.size !== stored.size) writeStored(kept)
  }, [ready, keysSignature])

  const dismiss = useCallback((key: string) => {
    // Baca ulang dulu: tab lain mungkin sudah menutup pengumuman lain sejak halaman ini dibuka
    writeStored(new Set(readStored()).add(key))
    setDismissed((prev) => new Set(prev ?? EMPTY).add(key))
  }, [])

  return { ready, dismissed: dismissed ?? EMPTY, dismiss }
}
