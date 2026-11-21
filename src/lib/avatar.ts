/**
 * Foto profil user; tanpa foto → avatar inisial yang dibuat di browser (SVG data URI).
 * Dulu memakai api.dicebear.com, yang membuat nama lengkap pembeli terkirim ke pihak ketiga di setiap halaman.
 */
export function getAvatarSrc(user: { name?: string; picture?: string | null }) {
  return user.picture || initialsAvatar(user.name || 'User')
}

/** Warna latar dipilih dari nama supaya avatar orang yang sama selalu sama. Teks putih terbaca di semuanya. */
const BACKGROUNDS = ['#2563eb', '#7c3aed', '#db2777', '#dc2626', '#ea580c', '#16a34a', '#0d9488', '#0891b2']

/** "Budi Santoso" → "BS", "Budi" → "BU"; nama tanpa huruf/angka → "U". */
function initialsOf(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(Boolean)
  if (words.length === 0) return 'U'
  const letters =
    words.length === 1 ? Array.from(words[0]).slice(0, 2) : [words[0], words[1]].map((word) => Array.from(word)[0])
  return letters.join('').toUpperCase()
}

function hashOf(text: string) {
  let hash = 0
  for (const char of text) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0
  return hash
}

const XML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }
const escapeXml = (text: string) => text.replace(/[&<>"']/g, (char) => XML_ESCAPES[char])

function initialsAvatar(name: string) {
  const background = BACKGROUNDS[hashOf(name) % BACKGROUNDS.length]
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<rect width="100" height="100" fill="${background}"/>` +
    `<text x="50" y="50" dy=".35em" text-anchor="middle" fill="#fff" ` +
    `font-family="system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="40" font-weight="600">` +
    `${escapeXml(initialsOf(name))}</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
