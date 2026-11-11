/**
 * Nama cookie & header sesi — dipakai bersama oleh browser, proxy route (/api/proxy), dan middleware.
 * Tidak boleh mengimpor modul server di sini: file ini ikut ter-bundle ke client.
 */

/** JWT sesi. HttpOnly → hanya server (proxy) yang bisa membacanya; script di halaman (termasuk XSS) tidak. */
export const SESSION_COOKIE = 'pg_session'

/** Cookie JWT lama yang ditulis js-cookie (bisa dibaca JS). Proxy memindahkannya ke SESSION_COOKIE lalu menghapusnya. */
export const LEGACY_TOKEN_COOKIE = 'token'

/** Profil tampilan (nama, email, foto) untuk navbar/checkout. Sengaja bisa dibaca JS — bukan kredensial. */
export const USER_COOKIE = 'user'

/**
 * Header wajib di request yang mengubah data. Situs lain tidak bisa memasang header custom lintas origin
 * tanpa izin CORS (yang tidak kita berikan), jadi cookie sesi tidak bisa ditunggangi lewat CSRF.
 */
export const CSRF_HEADER = 'x-pg-client'
export const CSRF_HEADER_VALUE = '1'

/** Token Cloudflare Turnstile dari widget di form auth; diverifikasi proxy sebelum diteruskan ke backend. */
export const TURNSTILE_HEADER = 'x-turnstile-token'
