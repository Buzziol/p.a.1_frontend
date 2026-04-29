import api from './api'
export const aiService = {
  analyze: (payload) => api.post('/ai/analyze', payload).then((r) => r.data),
  validate: (id, payload) => api.put(`/ai/${id}/validate`, payload).then((r) => r.data),
}
