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
    async getPermissions() {
      const response: PermissionsResponse = await http.get(PERMISSIONS_ENDPOINTS.PERMISSIONS)
      this.permissions = response.permissions
    }
  }
})
