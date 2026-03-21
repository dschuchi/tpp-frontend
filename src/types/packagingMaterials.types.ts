export interface PackagingMaterial {
  id?: number
  code: string
  description?: string
  customer_id: number | null
  supplier_id: number | null
  is_active?: boolean
  customer_name?: string
  supplier_name?: string
}

export interface PackagingMaterials {
  packagingMaterials: PackagingMaterial[]
}

export interface PackagingMaterialsResponse {
  packagingMaterials: PackagingMaterial[]
  total: number
}
