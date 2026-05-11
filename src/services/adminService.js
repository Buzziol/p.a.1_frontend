import api from './api'

export const adminService = {
  dashboard: () => api.get('/dashboard').then((r) => r.data),
  listClinics: () => api.get('/clinics').then((r) => r.data),
  createClinic: (payload) => api.post('/clinics', payload).then((r) => r.data),
  listUsers: () => api.get('/users').then((r) => r.data),
  createUser: (payload) => api.post('/users', payload).then((r) => r.data),
  listAuditLogs: () => api.get('/audit-logs').then((r) => r.data),
}
