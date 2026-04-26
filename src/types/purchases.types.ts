export interface PurchaseItem {
  id: number
  purchase_id: number
  raw_material_id: number
  packaging_material_id: number
  unit_price: string
  quantity: number
}

export interface PurchaseFormItem {
  raw_material_id?: number | null
  raw_material_name?: string
  packaging_material_id?: number | null
  packaging_material_name?: string
  unit_price: string
  quantity: number
}

export interface Purchase {
  id: number
  supplier_id: number
  status_id: number
  status: string
  observation: string
  scheduled_date: string
  received_date: string
  purchase_items: PurchaseItem[]
}

export interface PurchasesResponse {
  total: number
  purchases: Purchase[]
}

export interface PurchasesState {
  purchases: Purchase[]
}
