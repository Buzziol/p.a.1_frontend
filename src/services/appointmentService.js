import api from './api'

export const appointmentService = {
  list: (params = {}) => api.get('/appointments', { params }).then((r) => r.data),
  doctorList: () => api.get('/appointments/doctor').then((r) => r.data),
  doctorDay: (date) => api.get('/appointments/doctor/day', { params: { date } }).then((r) => r.data),
  create: (payload) => api.post('/appointments', payload).then((r) => r.data),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }).then((r) => r.data),
  reschedule: (id, scheduled_at) => api.put(`/appointments/${id}/reschedule`, { scheduled_at }).then((r) => r.data),
  cancel: (id) => api.delete(`/appointments/${id}`).then((r) => r.data),
}
