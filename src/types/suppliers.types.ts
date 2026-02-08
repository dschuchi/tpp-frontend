export type SuppliersState = SuppliersResponse

export interface SuppliersResponse {
  suppliers: ItemSuppliersResponse[]
}

export interface ItemSuppliersResponse {
  id: number,
  name: string,
  tax_id: string,
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
