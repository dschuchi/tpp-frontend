import { USERS_ENDPOINTS } from "@/api/endpoints"
import http from "@/api/http"
import type { UsersResponse, UsersState } from "@/types/users.types"

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    users: []
  }),

  actions: {
    async getUsers() {
      const response: UsersResponse = await http.get(USERS_ENDPOINTS.USERS)
      this.users = response.users
    }
  }
})
