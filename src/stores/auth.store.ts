import { defineStore } from 'pinia'
import type { LoginRequest } from '@/types/users.types'
import { authApi } from '@/api/auth.api'

interface AuthState {
  token: string | null
  loading: boolean,
  hydrated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    loading: false,
    hydrated: false
  }),

  getters: {
    isAuthenticated: state => !!state.token,
  },

  actions: {
    async login(credentials: LoginRequest) {
      this.loading = true
      try {
        const response = await authApi.login(credentials)
        this.token = response.accessToken
        localStorage.setItem('token', response.accessToken)
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = null
      localStorage.removeItem('token')
    },

    async me() {
      this.loading = true
      try {
        await authApi.me()
      } catch {
        this.logout()
      } finally {
        this.loading = false
        this.hydrated = true
      }
    }
  }
})
