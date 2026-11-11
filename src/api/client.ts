import axios from "axios";
import CryptoJS from "crypto-js";
import { getClientSecretKey } from "@/lib/cryptoClient";
import { CSRF_HEADER, CSRF_HEADER_VALUE } from "@/lib/session";
import { endSession } from "@/lib/sessionClient";

declare module "axios" {
  interface AxiosRequestConfig {
    /**
     * Endpoint auth publik (login, daftar, lupa/reset password): jangan auto-logout saat 401 —
     * di sini 401 berarti "password salah", bukan sesi kedaluwarsa. (Proxy sendiri yang memutuskan
     * kapan cookie sesi ditempelkan; endpoint ini tidak pernah ditempeli.)
     */
    skipAuth?: boolean;
  }
}

function handleAutoLogout() {
  if (typeof window === 'undefined') return;
  void endSession().finally(() => {
    // Redirect ke home, hindari redirect loop
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/';
    }
  });
}

// ─── Client-side API (via Next.js proxy) ─────────────────────────────────────
// Sesi dikirim otomatis lewat cookie HttpOnly (same-origin); JS tidak pernah memegang JWT.
export const api = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    [CSRF_HEADER]: CSRF_HEADER_VALUE,
  },
});

api.interceptors.request.use(
  (config) => {
    const mutateMethods = ["post", "put", "patch"];
    if (config.method && mutateMethods.includes(config.method) && config.data) {
      const key = getClientSecretKey();
      if (key) {
        const jsonStr = JSON.stringify(config.data);
        config.data = { payload: CryptoJS.AES.encrypt(jsonStr, key).toString() };
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: tangkap 401 dari server (token invalid/expired) ───
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuth) {
      handleAutoLogout();
    }
    return Promise.reject(error);
  }
);
