export interface ProductOrderStatus {
  id: number
  name: string
  is_active: boolean
}

export interface ProductOrderItem {
  id?: number
  product_order_id?: number
  batch_analysis_id: number
  quantity: number
}

export interface ProductOrder {
  id?: number
  product_id: number
  customer_order_id?: number | null
  quantity: number
  status_id?: number | null
  status?: string | null
  is_active?: boolean
  product_name?: string | null
}

export interface ProductRecipeItemRef {
  id: number
  product_id: number
  raw_material_id: number
  raw_material_name: string | null
  quantity: number
  unit: string
  is_active: boolean
}

export interface ProductRecipeRef {
  product_id: number
  product_name: string | null
  items: ProductRecipeItemRef[]
}

export interface ProductOrderDetail extends ProductOrder {
  product_order_items: ProductOrderItem[]
  recipe: ProductRecipeRef | null
}

export interface ProductOrdersResponse {
  productOrders: ProductOrder[]
  total: number
}
