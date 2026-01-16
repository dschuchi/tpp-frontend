import { ROLES_ENDPOINTS } from "@/api/endpoints"
import http from "@/api/http"
import type { RolesResponse, RolesState } from "@/types/roles.types"

export const useRolesStore = defineStore('roles', {
  state: (): RolesState => ({
    roles: []
  }),

  getters: {

  },

  actions: {
    async getRoles() {
      const response: RolesResponse = await http.get(ROLES_ENDPOINTS.ROLES)
      this.roles = response.roles
    }
  }
})
