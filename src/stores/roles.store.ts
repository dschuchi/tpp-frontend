import { ROLES_ENDPOINTS } from "@/api/endpoints"
import http from "@/api/http"
import type { CreateRoleRequest, Role, RolesResponse, RolesState, UpdateRoleRequest } from "@/types/roles.types"
import type { Filters } from "@/types/filters.types"

export const useRolesStore = defineStore('roles', {
  state: () => ({}),

  getters: {

  },

  actions: {
    async getRoles(page: number, limit: number, filters?: Filters) {
      const { search, ...rest } = filters ?? {}
      const response: RolesResponse = await http.get(ROLES_ENDPOINTS.ROLES, {
        params: {
          page,
          limit,
          name: search,
          ...rest
        }
      })
      return response
    },
    async deactivateRole(id: number) {
      await http.delete(ROLES_ENDPOINTS.ROLE_BY_ID(id))
    },
    async activateRole(id: number) {
      await http.patch(ROLES_ENDPOINTS.ACTIVATE_ROLE_BY_ID(id))
    },
    async createRole(role: CreateRoleRequest) {
      await http.post(ROLES_ENDPOINTS.ROLE, role)
    },
    async removePermission(id: number, permissionIds: number[]) {
      await http.delete(ROLES_ENDPOINTS.ROLE_PERMISSIONS_BY_ID(id), { data: { permissionIds } })
    },
    async addPermission(id: number, permissionIds: number[]) {
      await http.patch(ROLES_ENDPOINTS.ROLE_PERMISSIONS_BY_ID(id), { permissionIds })
    },
    async getRole(id: number) {
      const response: Role = await http.get(ROLES_ENDPOINTS.ROLE_BY_ID(id))
      return response
    },
    async updateRole(id: number, role: UpdateRoleRequest) {
      await http.patch(ROLES_ENDPOINTS.ROLE_BY_ID(id), role)
    }
  }
})
