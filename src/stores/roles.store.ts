import { ROLES_ENDPOINTS } from "@/api/endpoints"
import http from "@/api/http"
import type { CreateRoleRequest, RolePermissionsResponse, RolesResponse, RolesState } from "@/types/roles.types"

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
    async getRolePermissions(id: number) {
      const response: RolePermissionsResponse = await http.get(ROLES_ENDPOINTS.ROLE_PERMISSIONS_BY_ID(id))
      this.permissions = response.permissions
    },
    async removePermission(id: number, permissionId: number) {
      await http.delete(ROLES_ENDPOINTS.ROLE_PERMISSIONS_BY_ID(id), { data: { permissionId } })
      await this.getRolePermissions(id)
    },
    async addPermission(id: number, permissionId: number) {
      await http.post(ROLES_ENDPOINTS.ROLE_PERMISSIONS_BY_ID(id), { permissionId })
      await this.getRolePermissions(id)
    }
  }
})
