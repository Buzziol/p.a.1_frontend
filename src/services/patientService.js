import api from './api'
export const patientService = {
  list: (params = {}) => api.get('/patients', { params }).then((r) => r.data),
  create: (payload) => api.post('/patients', payload).then((r) => r.data),
}
