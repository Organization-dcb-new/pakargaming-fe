/** Foto profil user; tanpa foto → avatar inisial dari DiceBear. */
export function getAvatarSrc(user: { name?: string; picture?: string }) {
  return (
    user.picture ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}`
  )
}
