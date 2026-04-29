import api from './api'
export const appointmentService = {
  list: (params = {}) => api.get('/appointments', { params }).then((r) => r.data),
  create: (payload) => api.post('/appointments', payload).then((r) => r.data),
}
