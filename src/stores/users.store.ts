import { USERS_ENDPOINTS } from "@/api/endpoints"
import http from "@/api/http"
import type { DataTableOptions } from "@/types/table.types"
import type { CreateUserRequest, CreateUserResponse, UpdateUserRequest, UserListItem, UsersResponse, UsersState } from "@/types/users.types"

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    users: []
  }),

  actions: {
    async getUsers(page: number, limit: number, search?: string) {
      const response: UsersResponse = await http.get(USERS_ENDPOINTS.USERS, {
        params: {
          page,
          limit
        }
      })
      this.users = response.users
      return response
    },
    async deactivateUser(id: string) {
      await http.delete(USERS_ENDPOINTS.USER_BY_ID(id))
      //this.getUsers()
    },
    async activateUser(id: string) {
      await http.patch(USERS_ENDPOINTS.ACTIVATE_USER_BY_ID(id))
      //this.getUsers()
    },
    async createUser(user: CreateUserRequest) {
      const response: CreateUserResponse = await http.post(USERS_ENDPOINTS.USER, user)
      return response
    },
    async getUser(id: string) {
      const response: UserListItem = await http.get(USERS_ENDPOINTS.USER_BY_ID(id))
      return response
    },
    async updateUser(id: string, user: UpdateUserRequest) {
      await http.patch(USERS_ENDPOINTS.USER_BY_ID(id), user)
    }
  }
})
