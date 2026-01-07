import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://103.228.118.187:4001/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
