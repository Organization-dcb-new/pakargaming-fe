import CryptoJS from "crypto-js";

// Server-side (Next.js API route): uses ENCRYPT_SECRET_KEY (not exposed to browser)
// Client-side (browser): uses NEXT_PUBLIC_ENCRYPT_KEY

// Both must be the same value in .env
const getSecretKey = () => {
  const key = process.env.ENCRYPT_SECRET_KEY;
  if (!key) {
    console.error("❌ CRITICAL: ENCRYPT_SECRET_KEY is undefined in runtime!");
    return "";
  }
  return key;
};
/**
 * Encrypt data using AES (used by frontend before sending to /api/proxy)
 */
export function encryptPayload(data: unknown): string {
  const jsonStr = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonStr, getSecretKey()).toString();
}

/**
 * Decrypt AES payload (used by Next.js proxy route before forwarding to Go)
 */
export function decryptPayload<T = unknown>(ciphertext: string): T {
  const key = getSecretKey();
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted) as T;
}
