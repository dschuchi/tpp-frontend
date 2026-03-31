export interface Batch {
  id?: number
  batch_number: number
  quantity: number
  expiration_date?: string
  raw_material_id?: number | null
  packaging_material_id?: number | null
  supplier_id?: number | null
  customer_id?: number | null
  is_active?: boolean
  // Not from API
  raw_material_name?: string | null
  packaging_material_name?: string | null
  supplier_name?: string | null
  customer_name?: string | null
}

export interface BatchsState {
  batchs: Batch[]
}

export interface BatchsResponse {
  batches: Batch[]
  total: number
}
