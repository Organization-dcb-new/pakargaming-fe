import axios from 'axios'

export const api = axios.create({
  // baseURL: "/api",
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
