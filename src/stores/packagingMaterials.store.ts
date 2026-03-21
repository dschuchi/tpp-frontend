import { PACKAGING_MATERIALS_ENDPOINTS } from '@/api/endpoints'
import http from '@/api/http'
import type { PackagingMaterial, PackagingMaterials, PackagingMaterialsResponse } from '@/types/packagingMaterials.types'

export const usePackagingMaterialsStore = defineStore('packagingMaterials', {
  state: (): PackagingMaterials => ({
    packagingMaterials: []
  }),

  actions: {
    async getPackagingMaterials(page: number, limit: number) {
      const response: PackagingMaterialsResponse = await http.get(PACKAGING_MATERIALS_ENDPOINTS.PACKAGING_MATERIALS, {
        params: {
          page,
          limit
        }
      })
      this.packagingMaterials = response.packagingMaterials
      return response
    },
    async getPackagingMaterial(id: number): Promise<PackagingMaterial> {
      return await http.get(PACKAGING_MATERIALS_ENDPOINTS.PACKAGING_MATERIAL_BY_ID(id))
    },
    async create(packagingMaterial: PackagingMaterial) {
      await http.post(PACKAGING_MATERIALS_ENDPOINTS.PACKAGING_MATERIAL, packagingMaterial)
    },
    async update(id: number, packagingMaterial: PackagingMaterial) {
      await http.put(PACKAGING_MATERIALS_ENDPOINTS.PACKAGING_MATERIAL_BY_ID(id), packagingMaterial)
    },
    async deactivate(id: number) {
      await http.delete(PACKAGING_MATERIALS_ENDPOINTS.PACKAGING_MATERIAL_BY_ID(id))
    },
    async activate(id: number) {
      await http.patch(PACKAGING_MATERIALS_ENDPOINTS.ACTIVATE_PACKAGING_MATERIAL_BY_ID(id))
    }
  }
})
