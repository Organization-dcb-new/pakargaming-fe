'use client'

import { useLayoutEffect, useRef } from 'react'
import { useRouter } from '@/i18n/routing'
import { useRegion } from '@/hooks/useRegion'
import { HOME_REGION } from '@/lib/region'
import { GameDetail } from '@/types/game'

/**
 * Menyelaraskan region navbar dengan halaman game.
 *
 * - Pertama kali game ini tampil, link-nya yang menang: membuka `/games/mobile-legends-my` memindah
 *   region navbar ke Malaysia, supaya link yang dibagikan tetap membuka game yang dimaksud.
 * - Region yang diganti di navbar sesudahnya membawa ke versi game untuk region itu.
 *   Kalau game ini tidak dijual di sana, `regionMismatch` berisi region pilihan pembeli
 *   supaya halaman bisa memperingatkan bahwa produknya untuk region lain.
 *
 * Layout effect: penyelarasan selesai sebelum layar dilukis, jadi peringatan tidak sempat berkedip.
 */
export function useGameRegion(game: GameDetail | undefined) {
  const router = useRouter()
  const { choice, setRegion, ready } = useRegion()
  const syncedGameId = useRef<string | null>(null)
  const navigatingTo = useRef<string | null>(null)

  const gameRegion = game?.region || HOME_REGION
  const target = game?.regions?.find((r) => r.region === choice && r.slug !== game.slug)

  useLayoutEffect(() => {
    if (!game || !ready) return
    if (syncedGameId.current !== game.id) {
      syncedGameId.current = game.id
      navigatingTo.current = null
      setRegion(gameRegion)
      return
    }
    if (choice !== gameRegion && target && navigatingTo.current !== target.slug) {
      navigatingTo.current = target.slug
      router.replace(`/games/${target.slug}`)
    }
  }, [game, ready, choice, gameRegion, target, setRegion, router])

  return {
    gameRegion,
    /** Region pilihan pembeli yang tidak punya versi game ini; null bila cocok atau sedang pindah halaman. */
    regionMismatch: ready && game && choice !== gameRegion && !target ? choice : null,
    switchToGameRegion: () => setRegion(gameRegion),
  }
}
