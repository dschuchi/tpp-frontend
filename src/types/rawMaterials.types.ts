export interface RawMaterials {
  rawMaterials: RawMaterial[]
}

export interface RawMaterial {
  id?: number
  name: string
  is_active?: boolean
}

export interface RawMaterialsResponse {
  rawMaterials: RawMaterial[]
  total: number
}
