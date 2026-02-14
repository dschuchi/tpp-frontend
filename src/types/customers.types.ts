export interface Customer {
  id?: number;
  name: string;
  tax_id?: string;
  address?: string;
  phone?: string;
  email?: string;
  is_active?: boolean;
}

export interface Customers {
  customers: Customer[]
}
