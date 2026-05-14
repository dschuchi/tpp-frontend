import { PRODUCT_RECIPES_ENDPOINTS, PRODUCT_PACKAGE_MATERIALS_ENDPOINTS } from '@/api/endpoints'
import http from '@/api/http'
import type { ProductRecipeGroup, ProductRecipeItem } from '@/types/productRecipe.types'

export const useProductRecipeStore = defineStore('product-recipe', {
  actions: {
    async getRecipeByProductId(productId: number): Promise<ProductRecipeGroup | null> {
      return await http.get(PRODUCT_RECIPES_ENDPOINTS.PRODUCT_RECIPE_BY_PRODUCT_ID(productId))
    },

    async createRecipeItems(productId: number, items: { raw_material_id: number; percentage: number; observation: string }[]) {
      return await http.post(PRODUCT_RECIPES_ENDPOINTS.PRODUCT_RECIPE, {
        product_id: productId,
        items
      })
    },

    async updateRecipeItem(id: number, data: Partial<Pick<ProductRecipeItem, 'raw_material_id' | 'percentage' | 'observation'>>) {
      return await http.put(PRODUCT_RECIPES_ENDPOINTS.PRODUCT_RECIPE_BY_ID(id), data)
    },

    async deactivateRecipeItem(id: number) {
      return await http.delete(PRODUCT_RECIPES_ENDPOINTS.PRODUCT_RECIPE_BY_ID(id))
    },

    async activateRecipeItem(id: number) {
      return await http.patch(PRODUCT_RECIPES_ENDPOINTS.ACTIVATE_PRODUCT_RECIPE_BY_ID(id))
    },

    // Package materials (products_package_materials)
    async getPackageMaterialsByProductId(productId: number): Promise<any[]> {
      return await http.get(PRODUCT_PACKAGE_MATERIALS_ENDPOINTS.PRODUCT_PACKAGE_MATERIALS_BY_PRODUCT_ID(productId))
    },

    async addPackageMaterial(productId: number, packagingMaterialId: number) {
      return await http.post(PRODUCT_PACKAGE_MATERIALS_ENDPOINTS.PRODUCT_PACKAGE_MATERIAL, {
        product_id: productId,
        packaging_material_id: packagingMaterialId
      })
    },

    async removePackageMaterial(id: number) {
      return await http.delete(PRODUCT_PACKAGE_MATERIALS_ENDPOINTS.PRODUCT_PACKAGE_MATERIAL_BY_ID(id))
    }
  }
})
