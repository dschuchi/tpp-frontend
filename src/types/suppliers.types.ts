export type SuppliersState = SuppliersResponse

export interface SuppliersResponse {
  suppliers: SupplierDetailResponse[]
}

export interface SupplierDetailResponse {
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
