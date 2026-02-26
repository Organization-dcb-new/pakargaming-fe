import axios from "axios";
import { encryptPayload } from "@/lib/crypto";

// ─── Client-side API (via Next.js proxy) ─────────────────────────────────────
export const api = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const mutateMethods = ["post", "put", "patch"];
  if (config.method && mutateMethods.includes(config.method) && config.data) {
    config.data = { payload: encryptPayload(config.data) };
  }
  return config;
});

export const serverApi = axios.create({
  baseURL: process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
