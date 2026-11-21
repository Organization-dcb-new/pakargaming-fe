/**
 * Karakter latar (beranda + halaman top-up), dirender oleh <CharacterBackdrop>.
 *
 * Cara menambah:
 * 1. Taruh file di `public/backdrop/characters/` — PNG/WebP berlatar transparan, tinggi ≥ 1200px,
 *    karakter menghadap ke tengah layar (kiri menghadap kanan, kanan menghadap kiri).
 * 2. Tambahkan entri di bawah.
 * 3. Catat sumber + dasar hak pakainya di ATTRIBUTIONS.md. Art resmi game (ML, Free Fire, Genshin, …)
 *    adalah hak cipta penerbitnya — pakai hanya bila PakarGaming punya izin.
 *
 * Kosong = tidak ada karakter (latar item seperti biasa).
 */
export type BackdropCharacter = {
  /** Path publik, mis. '/backdrop/characters/warrior.webp' */
  src: string
  /** Sisi tampil di beranda. Beranda memakai satu karakter kiri + satu kanan (entri pertama tiap sisi). */
  side: 'left' | 'right'
  /** Slug game (/games/[slug]) yang menampilkan karakter ini di halaman top-up-nya. */
  games?: string[]
}

export const BACKDROP_CHARACTERS: BackdropCharacter[] = [
  // Genshin Impact (HoYoverse) — catat dasar izin pakainya di ATTRIBUTIONS.md
  { src: '/backdrop/characters/genshin-sucrose.webp', side: 'left' },
  // TODO: samakan slug dengan slug game Genshin di backend (/games/<slug>)
  { src: '/backdrop/characters/genshin-bennett.webp', side: 'right', games: ['genshin-impact'] },
]
