import { defineStore } from 'pinia'
import { authApi } from '@/api/auth.api'
import { useUserStore } from './user.store'

import type { LoginRequest } from '@/types/users.types'
import type { AuthState } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    hydrated: false
  }),

  getters: {
    isAuthenticated: state => !!state.token,
  },

  actions: {
    async login(credentials: LoginRequest) {
      try {
        const response = await authApi.login(credentials)
        this.token = response.accessToken
        localStorage.setItem('token', response.accessToken)

        const userStore = useUserStore()
        userStore.setUser(response)
      } finally {
      }
    },

    logout() {
      this.token = null
      localStorage.removeItem('token')

      const userStore = useUserStore()
      userStore.clearUser()
    },

    async me() {
      try {
        const response = await authApi.me()

        const userStore = useUserStore()
        userStore.setUser(response)
      } catch {
        this.logout()
      } finally {
        this.hydrated = true
      }
    }
  }
})
