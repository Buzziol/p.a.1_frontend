import api from './api'
export const medicalRecordService = {
  getById: (id) => api.get(`/medical-records/${id}`).then((r) => r.data),
  create: (payload) => api.post('/medical-records', payload).then((r) => r.data),
}
