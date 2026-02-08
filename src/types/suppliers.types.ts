export type SuppliersState = SuppliersResponse

export interface SuppliersResponse {
  suppliers: ItemSuppliersResponse[]
}

export interface ItemSuppliersResponse {
  id: number,
  name: string,
  tax_id: string
}
