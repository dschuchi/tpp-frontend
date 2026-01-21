import { ROLES_ENDPOINTS } from "@/api/endpoints"
import http from "@/api/http"
import type { CreateRoleRequest, RolesResponse, RolesState } from "@/types/roles.types"

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
    },
    async deactivateRole(id: number) {
      await http.delete(ROLES_ENDPOINTS.ROLE_BY_ID(id))
      this.getRoles()
    },
    async activateRole(id: number) {
      await http.patch(ROLES_ENDPOINTS.ACTIVATE_ROLE_BY_ID(id))
      this.getRoles()
    },
    async createRole(role: CreateRoleRequest) {
     await http.post(ROLES_ENDPOINTS.ROLE, role)
    }
  }
})
