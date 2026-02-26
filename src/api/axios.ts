import axios from 'axios'
import { encryptPayload } from '@/lib/crypto'

// All requests go through Next.js API proxy (/api/proxy/...)
// Browser will only see requests to /api/proxy, never the real backend URL
export const api = axios.create({
  baseURL: '/api/proxy',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export const apiServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})

// Encrypt POST / PUT / PATCH payloads before sending
api.interceptors.request.use((config) => {
  const mutateMethods = ['post', 'put', 'patch']
  if (config.method && mutateMethods.includes(config.method) && config.data) {
    config.data = { payload: encryptPayload(config.data) }
  }
  return config
})
