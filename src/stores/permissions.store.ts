import { PERMISSIONS_ENDPOINTS } from "@/api/endpoints"
import http from "@/api/http"
import type { PermissionsResponse, PermissionsState } from "@/types/permissions.types"

export const usePermissionsStore = defineStore('permissions', {
  state: (): PermissionsState => ({
    permissions: []
  }),

  getters: {

  },

  actions: {
    async getPermissions(page: number, limit: number, search?: string) {
      const response: PermissionsResponse = await http.get(PERMISSIONS_ENDPOINTS.PERMISSIONS, {
        params: {
          page,
          limit,
          name: search
        }
      })
      this.permissions = response.permissions
      return response
    }
  }
})
