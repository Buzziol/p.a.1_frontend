import api from './api'
export const documentService = {
  upload: ({ file, medical_record_id }) => {
    const form = new FormData()
    form.append('file', file)
    form.append('medical_record_id', medical_record_id)
    return api.post('/documents/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
  },
}
