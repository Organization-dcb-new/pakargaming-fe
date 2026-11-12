import CryptoJS from "crypto-js";

/**
 * Dekripsi body request di proxy (/api/proxy). BUKAN kontrol keamanan: ENCRYPT_SECRET_KEY yang sama
 * dikirim ke browser lewat CryptoProvider (layout.tsx), dan proxy juga menerima body polos. Siapa pun
 * bisa membaca/membuat payload-nya — kerahasiaan datang dari HTTPS, validasi tetap di backend.
 * Jangan dipakai untuk melindungi data apa pun, dan jangan isi kunci ini dengan rahasia lain.
 */
const getSecretKey = () => {
  const key = process.env.ENCRYPT_SECRET_KEY;
  if (!key) {
    console.error("❌ CRITICAL: ENCRYPT_SECRET_KEY is undefined in runtime!");
    return "";
  }
  return key;
};


/**
 * Decrypt AES payload (used by Next.js proxy route before forwarding to Go)
 */
export function decryptPayload<T = unknown>(ciphertext: string): T {
  const key = getSecretKey();
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted) as T;
}
