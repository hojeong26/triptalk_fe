import axios from 'axios'

export const apiClient = axios.create({
  baseURL: 'https://triptalk-be-sjlq.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
