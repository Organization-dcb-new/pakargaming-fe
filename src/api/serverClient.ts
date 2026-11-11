import axios from "axios";

/**
 * Client untuk kode server (sitemap, metadata): langsung ke backend, tanpa proxy, sesi, atau enkripsi.
 * Jangan dipakai di browser — backend menolak request yang bukan dari IP server FE.
 */
export const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
