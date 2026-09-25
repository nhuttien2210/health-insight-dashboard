import axios from 'axios'

export const http = axios.create({
  headers: { Accept: 'application/json' },
  timeout: 15_000,
})
