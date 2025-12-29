import { defineStore } from 'pinia'
import type { LoginRequest } from '@/types/users.types'
import { usersApi } from '@/api/users.api'

interface AuthState {
  name: string | null;
  lastname: string | null;
  token: string | null
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    name: localStorage.getItem('name'),
    lastname: localStorage.getItem('lastname'),
    token: localStorage.getItem('token'),
    loading: false,
  }),

  actions: {
    async login(credentials: LoginRequest) {
      this.loading = true
      try {
        const response = await usersApi.login(credentials)

        this.token = response.accessToken
        this.name = response.name
        this.lastname = response.lastname

        localStorage.setItem('token', response.accessToken)
        localStorage.setItem('name', response.name)
        localStorage.setItem('lastname', response.lastname)
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.name = null
      this.lastname = null
      this.token = null

      localStorage.removeItem('token')
      localStorage.removeItem('name')
      localStorage.removeItem('lastname')
    }
  }
})
