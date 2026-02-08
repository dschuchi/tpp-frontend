import { SUPPLIERS_ENDPOINTS } from "@/api/endpoints"
import http from "@/api/http"
import type { NewSupplierRequest, SuppliersResponse, SuppliersState, UpdateSupplierRequest } from "@/types/suppliers.types"

export const useSuppliersStore = defineStore('suppliers', {
  state: (): SuppliersState => ({
    suppliers: []
  }),

  actions: {
    async getSuppliers() {
      const response: SuppliersResponse = await http.get(SUPPLIERS_ENDPOINTS.SUPPLIERS)
      this.suppliers = response.suppliers
    },
    async create(supplier: NewSupplierRequest) {
      await http.post(SUPPLIERS_ENDPOINTS.SUPPLIER, supplier)
      this.getSuppliers()
    },
    async update(id: number, supplier: UpdateSupplierRequest) {
      await http.patch(SUPPLIERS_ENDPOINTS.SUPPLIER_BY_ID(id), supplier)
      this.getSuppliers()
    },
    async deactivate(id: number) {
      await http.delete(SUPPLIERS_ENDPOINTS.SUPPLIER_BY_ID(id))
      this.getSuppliers()
    },
    async activate(id: number) {
      await http.patch(SUPPLIERS_ENDPOINTS.ACTIVATE_SUPPLIER_BY_ID(id))
      this.getSuppliers()
    }
  }
})
