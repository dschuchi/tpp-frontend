import { PACKAGING_MATERIALS_ENDPOINTS } from '@/api/endpoints'
import http from '@/api/http'
import type { PackagingMaterial, PackagingMaterials } from '@/types/packagingMaterials.types'

export const usePackagingMaterialsStore = defineStore('packagingMaterials', {
  state: (): PackagingMaterials => ({
    packagingMaterials: []
  }),

  actions: {
    async getPackagingMaterials() {
      const response: PackagingMaterials = await http.get(PACKAGING_MATERIALS_ENDPOINTS.PACKAGING_MATERIALS)
      this.packagingMaterials = response.packagingMaterials
    },
    async getPackagingMaterial(id: number): Promise<PackagingMaterial> {
      return await http.get(PACKAGING_MATERIALS_ENDPOINTS.PACKAGING_MATERIAL_BY_ID(id))
    },
    async create(packagingMaterial: PackagingMaterial) {
      await http.post(PACKAGING_MATERIALS_ENDPOINTS.PACKAGING_MATERIAL, packagingMaterial)
      this.getPackagingMaterials()
    },
    async update(id: number, packagingMaterial: PackagingMaterial) {
      await http.put(PACKAGING_MATERIALS_ENDPOINTS.PACKAGING_MATERIAL_BY_ID(id), packagingMaterial)
      this.getPackagingMaterials()
    },
    async deactivate(id: number) {
      await http.delete(PACKAGING_MATERIALS_ENDPOINTS.PACKAGING_MATERIAL_BY_ID(id))
      this.getPackagingMaterials()
    },
    async activate(id: number) {
      await http.patch(PACKAGING_MATERIALS_ENDPOINTS.ACTIVATE_PACKAGING_MATERIAL_BY_ID(id))
      this.getPackagingMaterials()
    }
  }
})
