import axios from "axios";
import Cookies from 'js-cookie'
import CryptoJS from "crypto-js";
import { getClientSecretKey } from "@/lib/cryptoClient";

// ─── Helper: decode JWT payload tanpa library tambahan ────────────────────────
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp dalam detik, Date.now() dalam milidetik
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // jika token tidak valid, anggap expired
  }
}

function handleAutoLogout() {
  Cookies.remove('token');
  Cookies.remove('user');
  // Redirect ke home, hindari redirect loop
  if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
    window.location.href = '/';
  }
}

// ─── Client-side API (via Next.js proxy) ─────────────────────────────────────
export const api = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      // Cek apakah token sudah expired sebelum request dikirim
      if (isTokenExpired(token)) {
        handleAutoLogout();
        return Promise.reject(new Error('Token expired'));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

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
    if (error.response?.status === 401) {
      handleAutoLogout();
    }
    return Promise.reject(error);
  }
);

export const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
