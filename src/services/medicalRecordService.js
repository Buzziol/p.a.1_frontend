import api from './api'

export const medicalRecordService = {
  list: (params = {}) => api.get('/medical-records', { params }).then((r) => r.data),
  getById: (id) => api.get(`/medical-records/${id}`).then((r) => r.data),
  create: (payload) => api.post('/medical-records', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/medical-records/${id}`, payload).then((r) => r.data),
}
