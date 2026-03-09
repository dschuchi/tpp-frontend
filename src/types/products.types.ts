export interface Product {
  id?: number
  name: string
  customer_id: number | null
  version: string
  observaciones?: string
  is_active?: boolean
}

export interface Products {
  products: Product[]
}
