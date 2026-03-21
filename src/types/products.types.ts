export interface Product {
  id?: number
  name: string
  customer_id: number | null
  version: string
  observaciones?: string
  is_active?: boolean
  customer_name?: string
}

export interface Products {
  products: Product[]
}

export interface ProductsResponse {
  products: Product[]
  total: number
}
