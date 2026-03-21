export interface Customer {
  id?: number;
  name: string;
  tax_id: string;
  address: string;
  phone: string;
  email: string;
  is_active?: boolean;
}

export interface CustomersReponse {
  customers: Customer[]
  total: number
}

export interface CustomersState {
  customers: Customer[]
}
