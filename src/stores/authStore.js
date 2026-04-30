import { defineStore } from 'pinia'
import { authService } from '../services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('access_token') || '',
    user: null,
    role: null,
    clinic: null,
    loading: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(email, password) {
      this.loading = true
      try {
        const response = await authService.login({
          email,
          password
        })

        const data = response.data
        this.token = data.access_token
        localStorage.setItem('access_token', data.access_token)
        await this.fetchMe()
      } finally {
        this.loading = false
      }
    },
    async fetchMe() {
      const response = await authService.me()
      const me = response.data

      this.user = me
      this.role = me.role || me.user?.role
      this.clinic = me.clinic || me.user?.clinic || null
    },
    logout() {
      this.token = ''
      this.user = null
      this.role = null
      this.clinic = null
      localStorage.removeItem('access_token')
    },
    hasRole(roles = []) {
      return roles.includes(this.role)
    },
  },
})
