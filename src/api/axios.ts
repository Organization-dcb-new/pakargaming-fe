import axios from "axios";
import Cookies from 'js-cookie'
import CryptoJS from "crypto-js";
import { getClientSecretKey } from "@/lib/cryptoClient";

// ─── Client-side API (via Next.js proxy) ─────────────────────────────────────
export const api = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
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
});

export const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
