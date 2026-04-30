import api from './api'

export const authService = {
  login(credentials) {
    console.log('LOGIN PAYLOAD:', credentials)
    return api.post('/auth/login', credentials)
  },

  me() {
    return api.get('/auth/me')
  }
}
