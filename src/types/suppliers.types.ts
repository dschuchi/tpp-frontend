export interface SuppliersState {
  suppliers: Supplier[]
}

export interface SuppliersResponse {
  suppliers: Supplier[]
  total: number
}

export interface Supplier {
  id: number
  name: string
  tax_id: string
  address: string
  phone: string
  email: string
  is_active: boolean
}

export interface NewSupplierRequest {
  name: string
  tax_id: string
  address: string
  phone: string
  email: string
}

export type UpdateSupplierRequest = NewSupplierRequest
