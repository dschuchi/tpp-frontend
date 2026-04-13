export interface CustomerOrderStatus {
  id: number
  name: string
  is_active: boolean
}

export interface CustomerOrderItem {
  id?: number
  customer_order_id?: number
  product_id: number | null
  unit_price: string
  quantity: number
  product_name?: string | null
}

export interface CustomerOrder {
  id?: number
  customer_id: number
  responsable_id?: string | null
  tax?: string | null
  total: string
  presentation?: string | null
  package_detail?: string | null
  inputs_provided_by_customer?: boolean
  estimated_date?: string | null
  observations?: string | null
  status_id?: number | null
  status?: string | null
  is_active?: boolean
  customer_name?: string | null
}

export interface CustomerOrderDetail extends CustomerOrder {
  customer_order_items: CustomerOrderItem[]
}

export interface CustomerOrdersResponse {
  customerOrders: CustomerOrder[]
  total: number
}
