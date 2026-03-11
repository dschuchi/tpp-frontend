export interface PackagingMaterial {
  id?: number
  code: string
  description?: string
  customer_id: number | null
  supplier_id: number | null
  is_active?: boolean
}

export interface PackagingMaterials {
  packagingMaterials: PackagingMaterial[]
}
