import { ROLES_ENDPOINTS } from "@/api/endpoints"
import http from "@/api/http"
import type { CreateRoleRequest, Role, RolesResponse, RolesState, UpdateRoleRequest } from "@/types/roles.types"

export const useRolesStore = defineStore('roles', {
  state: (): RolesState => ({
    roles: [],
    permissions: []
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
    },
    async removePermission(id: number, permissionId: number) {
      await http.delete(ROLES_ENDPOINTS.ROLE_PERMISSIONS_BY_ID(id), { data: { permissionId } })
      await this.getRole(id)
    },
    async addPermission(id: number, permissionId: number) {
      await http.patch(ROLES_ENDPOINTS.ROLE_PERMISSIONS_BY_ID(id), { permissionId })
      await this.getRole(id)
    },
    async getRole(id: number) {
      const response: Role = await http.get(ROLES_ENDPOINTS.ROLE_BY_ID(id))
      this.role = response
      this.permissions = response.permissions
    },
    async updateRole(id: number, role: UpdateRoleRequest) {
      await http.patch(ROLES_ENDPOINTS.ROLE_BY_ID(id), role)
    }
  }
})
