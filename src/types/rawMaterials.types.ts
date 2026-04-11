export interface RawMaterials {
  rawMaterials: RawMaterial[]
}

export interface RawMaterial {
  id?: number
  name: string
  is_active?: boolean
  density?: number
}

export interface RawMaterialsResponse {
  rawMaterials: RawMaterial[]
  total: number
}
