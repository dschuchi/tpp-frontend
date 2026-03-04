import {RAW_MATERIALS_ENDPOINTS} from "@/api/endpoints"
import http from "@/api/http"
import type {RawMaterial, RawMaterials} from "@/types/rawMaterials.types"

export const useRawMaterialsStore = defineStore('raw-materials', {
  state: (): RawMaterials => ({
    rawMaterials: []
  }),

  actions: {
    async getRawMaterials() {
      const response: RawMaterials = await http.get(RAW_MATERIALS_ENDPOINTS.RAW_MATERIALS)
      this.rawMaterials = response.rawMaterials
    },
    async create(rawMaterial: RawMaterial) {
      await http.post(RAW_MATERIALS_ENDPOINTS.RAW_MATERIAL, rawMaterial)
      this.getRawMaterials()
    },
    async update(id: number, rawMaterial: RawMaterial) {
      await http.put(RAW_MATERIALS_ENDPOINTS.RAW_MATERIAL_BY_ID(id), rawMaterial)
      this.getRawMaterials()
    },
    async getRawMaterial(id: number) {
      return await http.get(RAW_MATERIALS_ENDPOINTS.RAW_MATERIAL_BY_ID(id))
    },
    async deactivate(id: number) {
      await http.delete(RAW_MATERIALS_ENDPOINTS.RAW_MATERIAL_BY_ID(id))
      this.getRawMaterials()
    },
    async activate(id: number) {
      await http.patch(RAW_MATERIALS_ENDPOINTS.ACTIVATE_RAW_MATERIAL_BY_ID(id))
      this.getRawMaterials()
    }
  }
})
