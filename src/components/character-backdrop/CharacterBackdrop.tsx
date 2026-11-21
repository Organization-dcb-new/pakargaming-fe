import Image from 'next/image'
import { BACKDROP_CHARACTERS, type BackdropCharacter } from '@/config/characters'

/** Beranda: satu karakter kiri + satu kanan. Halaman game: karakter milik game itu, di kanan. */
function pickCharacters(gameSlug?: string): BackdropCharacter[] {
  if (gameSlug) {
    const match = BACKDROP_CHARACTERS.find((c) => c.games?.includes(gameSlug))
    return match ? [{ ...match, side: 'right' }] : []
  }
  return (['left', 'right'] as const)
    .map((side) => BACKDROP_CHARACTERS.find((c) => c.side === side))
    .filter((c): c is BackdropCharacter => Boolean(c))
}

/**
 * Karakter besar di sisi kiri/kanan, di belakang konten (di atas latar item GameBackdrop).
 * Hanya layar ≥ xl: di HP/tablet tidak ada ruang samping sehingga karakter akan menutupi konten.
 * Memudar ke arah konten & ke bawah; kekuatannya diatur token --character-opacity (light/dark).
 */
export function CharacterBackdrop({ gameSlug }: { gameSlug?: string }) {
  const characters = pickCharacters(gameSlug)
  if (characters.length === 0) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden xl:block">
      {characters.map(({ src, side }) => (
        <div
          key={`${side}-${src}`}
          className={`absolute bottom-0 h-[85vh] w-[min(34vw,36rem)] opacity-(--character-opacity) ${
            side === 'left'
              ? 'left-0 -translate-x-[10%] [mask-image:linear-gradient(to_right,black_65%,transparent)]'
              : 'right-0 translate-x-[10%] [mask-image:linear-gradient(to_left,black_65%,transparent)]'
          }`}
        >
          <div className="relative size-full [mask-image:linear-gradient(to_top,transparent,black_20%)]">
            <Image src={src} alt="" fill sizes="34vw" className="object-contain object-bottom" />
          </div>
        </div>
      ))}
    </div>
  )
}
