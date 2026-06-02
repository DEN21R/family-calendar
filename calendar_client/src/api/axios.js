import axios from 'axios'

const defaultApiBaseUrl =
  import.meta.env.DEV ?
    'http://localhost:3333/api'
  : `${window.location.origin}/api`

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultApiBaseUrl,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const hasToken = Boolean(localStorage.getItem('token'))

    if (error.response?.status === 401 && hasToken) {
      localStorage.removeItem('token')
      window.location.href = '/dashboard'
    }

    return Promise.reject(error)
  },
)

export default apiClient
