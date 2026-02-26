import CryptoJS from "crypto-js";

// Server-side (Next.js API route): uses ENCRYPT_SECRET_KEY (not exposed to browser)
// Client-side (browser): uses NEXT_PUBLIC_ENCRYPT_KEY
// Both must be the same value in .env
const SECRET_KEY =
  process.env.ENCRYPT_SECRET_KEY || process.env.NEXT_PUBLIC_ENCRYPT_KEY;

/**
 * Encrypt data using AES (used by frontend before sending to /api/proxy)
 */
export function encryptPayload(data: unknown): string {
  const jsonStr = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonStr, SECRET_KEY).toString();
}

/**
 * Decrypt AES payload (used by Next.js proxy route before forwarding to Go)
 */
export function decryptPayload<T = unknown>(ciphertext: string): T {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted) as T;
}
