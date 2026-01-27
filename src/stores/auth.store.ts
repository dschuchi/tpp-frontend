import { defineStore } from 'pinia'
import { useUserStore } from './user.store'

import type { LoginRequest, LoginResponse } from '@/types/users.types'
import type { AuthState } from '@/types/auth.types'
import { USERS_ENDPOINTS } from '@/api/endpoints'
import http from '@/api/http'

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
        const response: LoginResponse = await http.post(USERS_ENDPOINTS.LOGIN, credentials)
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
        const response: LoginResponse = await http.get(USERS_ENDPOINTS.ME)

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
