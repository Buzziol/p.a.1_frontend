import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  config.headers['Content-Type'] = 'application/json'

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      localStorage.removeItem('access_token')
      if (window.location.pathname !== '/login') window.location.href = '/login'
    }
    if (status === 403 && window.location.pathname !== '/forbidden') {
      window.location.href = '/forbidden'
    }
    return Promise.reject(error)
  }
)

export default api
