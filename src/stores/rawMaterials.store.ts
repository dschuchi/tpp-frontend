import { RAW_MATERIALS_ENDPOINTS } from "@/api/endpoints"
import http from "@/api/http"
import type { RawMaterial, RawMaterials, RawMaterialsResponse } from "@/types/rawMaterials.types"

export const useRawMaterialsStore = defineStore('raw-materials', {
  state: (): RawMaterials => ({
    rawMaterials: []
  }),

  actions: {
    async getRawMaterials(page: number, limit: number) {
      const response: RawMaterialsResponse = await http.get(RAW_MATERIALS_ENDPOINTS.RAW_MATERIALS, {
        params: {
          page,
          limit
        }
      })
      this.rawMaterials = response.rawMaterials
      return response
    },
    async create(rawMaterial: RawMaterial) {
      await http.post(RAW_MATERIALS_ENDPOINTS.RAW_MATERIAL, rawMaterial)
    },
    async update(id: number, rawMaterial: RawMaterial) {
      await http.put(RAW_MATERIALS_ENDPOINTS.RAW_MATERIAL_BY_ID(id), rawMaterial)
    },
    async getRawMaterial(id: number): Promise<RawMaterial> {
      return await http.get(RAW_MATERIALS_ENDPOINTS.RAW_MATERIAL_BY_ID(id))
    },
    async deactivate(id: number) {
      await http.delete(RAW_MATERIALS_ENDPOINTS.RAW_MATERIAL_BY_ID(id))
    },
    async activate(id: number) {
      await http.patch(RAW_MATERIALS_ENDPOINTS.ACTIVATE_RAW_MATERIAL_BY_ID(id))
    }
  }
})
