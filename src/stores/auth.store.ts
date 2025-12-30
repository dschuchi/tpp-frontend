import { defineStore } from 'pinia'
import type { LoginRequest } from '@/types/users.types'
import { usersApi } from '@/api/auth.api'

interface AuthState {
  token: string | null
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    loading: false,
  }),

  getters: {
    isAuthenticated: state => !!state.token,
  },

  actions: {
    async login(credentials: LoginRequest) {
      this.loading = true
      try {
        const response = await usersApi.login(credentials)
        this.token = response.accessToken
        localStorage.setItem('token', response.accessToken)
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = null
      localStorage.removeItem('token')
    }
  }
})
