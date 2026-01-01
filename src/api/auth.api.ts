import http from './http'
import { USERS_ENDPOINTS } from './endpoints'
import type { LoginRequest, LoginResponse } from '@/types/users.types'

export const usersApi = {
  login(payload: LoginRequest): Promise<LoginResponse> {
    return http.post(USERS_ENDPOINTS.LOGIN, payload)
  },
  me() {
    return http.get(USERS_ENDPOINTS.ME)
  }
}
