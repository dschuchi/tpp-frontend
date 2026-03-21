import { SUPPLIERS_ENDPOINTS } from "@/api/endpoints"
import http from "@/api/http"
import type { NewSupplierRequest, Supplier, SuppliersResponse, SuppliersState, UpdateSupplierRequest } from "@/types/suppliers.types"

export const useSuppliersStore = defineStore('suppliers', {
  state: (): SuppliersState => ({
    suppliers: []
  }),

  actions: {
    async getSuppliers(page: number, limit: number, filters?: any) {
      const response: SuppliersResponse = await http.get(SUPPLIERS_ENDPOINTS.SUPPLIERS, {
        params: {
          page,
          limit,
          ...filters
        }
      })
      this.suppliers = response.suppliers
      return response
    },
    async create(supplier: NewSupplierRequest) {
      await http.post(SUPPLIERS_ENDPOINTS.SUPPLIER, supplier)
    },
    async update(id: number, supplier: UpdateSupplierRequest) {
      await http.put(SUPPLIERS_ENDPOINTS.SUPPLIER_BY_ID(id), supplier)
    },
    async getSupplier(id: number) {
      const response: Supplier = await http.get(SUPPLIERS_ENDPOINTS.SUPPLIER_BY_ID(id))
      return response
    },
    async deactivate(id: number) {
      await http.delete(SUPPLIERS_ENDPOINTS.SUPPLIER_BY_ID(id))
    },
    async activate(id: number) {
      await http.patch(SUPPLIERS_ENDPOINTS.ACTIVATE_SUPPLIER_BY_ID(id))
    }
  }
})
