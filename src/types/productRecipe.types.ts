export interface ProductRecipeItem {
  id?: number
  product_id: number
  raw_material_id: number
  raw_material_name?: string | null
  quantity: number
  unit: string
  is_active?: boolean
}

export interface ProductRecipeGroup {
  product_id: number
  product_name?: string | null
  items: ProductRecipeItem[]
}

export interface ProductRecipesResponse {
  productRecipes: ProductRecipeGroup[]
  total: number
}
