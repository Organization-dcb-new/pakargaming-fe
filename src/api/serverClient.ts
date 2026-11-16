import axios from "axios";
import { getServerApiBaseUrl } from "@/config/runtimeEnv";

/**
 * Client untuk kode server (sitemap, metadata): langsung ke backend, tanpa proxy, sesi, atau enkripsi.
 * Jangan dipakai di browser — backend menolak request yang bukan dari IP server FE.
 * Base URL dibaca saat runtime (.env server: API_INTERNAL_URL, kalau kosong NEXT_PUBLIC_API_BASE_URL).
 */
export const serverApi = axios.create({
  baseURL: getServerApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
