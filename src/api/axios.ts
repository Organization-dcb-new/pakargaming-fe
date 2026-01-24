import axios from 'axios'

// export const api = axios.create({
//   baseURL: 'https://dev-api.pakargaming.id',
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   },
// })

// export const api = axios.create({
//   baseURL: 'http://localhost:4001',
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   },
// })

export const api = axios.create({
  baseURL: 'https://api.pakargaming.id',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
