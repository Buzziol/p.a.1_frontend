import api from './api'

export const authService = {
  login(credentials) {
    console.log('LOGIN PAYLOAD:', credentials)
    return api.post('/auth/login', credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },

  me() {
    return api.get('/auth/me')
  }
}
