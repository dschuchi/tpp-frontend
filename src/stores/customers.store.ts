import { CUSTOMERS_ENDPOINTS, ROLES_ENDPOINTS } from "@/api/endpoints"
import http from "@/api/http"
import type { Customer, CustomersReponse, CustomersState } from "@/types/customers.types.ts";

export const useCustomersStore = defineStore('customers', {
  state: (): CustomersState => ({
    customers: [],
  }),
  getters: {

  },
  actions: {
    async getCustomers(page: number, limit: number) {
      const response: CustomersReponse = await http.get(CUSTOMERS_ENDPOINTS.CUSTOMERS,{
        params: {
          page,
          limit
        }
      })
      this.customers = response.customers
      return response
    },
    async getCustomer(id: number) {
      const customerFound: Customer | undefined = this.customers.find(c => c.id === id)
      if (customerFound) return customerFound

      const customerResponse: Customer = await http.get(CUSTOMERS_ENDPOINTS.CUSTOMER_BY_ID(id))
      if (customerResponse) this.customers.push(customerResponse)

      return customerResponse
    },
    async createCustomer(customer: Customer) {
      await http.post(CUSTOMERS_ENDPOINTS.CUSTOMER, customer)
    },
    async updateCustomer(id: number, customer: Customer) {
      await http.put(CUSTOMERS_ENDPOINTS.CUSTOMER_BY_ID(id), customer)
    },
    async deactivateCustomer(id: number) {
      await http.delete(CUSTOMERS_ENDPOINTS.CUSTOMER_BY_ID(id))
    },
    async activateCustomer(id: number) {
      await http.patch(CUSTOMERS_ENDPOINTS.ACTIVATE_CUSTOMER_BY_ID(id))
    },
  }
})
