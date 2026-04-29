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
    async login(credentials) {
      this.loading = true
      try {
        const data = await authService.login(credentials)
        this.token = data.access_token
        localStorage.setItem('access_token', this.token)
        await this.fetchMe()
      } finally {
        this.loading = false
      }
    },
    async fetchMe() {
      const me = await authService.me()
      this.user = me
      this.role = me.role
      this.clinic = me.clinic || null
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
