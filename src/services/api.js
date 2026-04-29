import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
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

export async function predict(file, patientId = null) {
  const formData = new FormData()
  formData.append('file', file)
  if (patientId) formData.append('patient_id', patientId)
  const response = await api.post('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export async function healthCheck() {
  const response = await api.get('/health')
  return response.data
}

export default api
