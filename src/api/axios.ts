import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:4444',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
