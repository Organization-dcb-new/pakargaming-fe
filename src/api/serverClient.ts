import axios from "axios";
import { getApiBaseUrl } from "@/config/runtimeEnv";

/**
 * Client untuk kode server (sitemap, metadata): langsung ke backend, tanpa proxy, sesi, atau enkripsi.
 * Jangan dipakai di browser — backend menolak request yang bukan dari IP server FE.
 * Base URL dibaca saat runtime (.env server), bukan saat build.
 */
export const serverApi = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
