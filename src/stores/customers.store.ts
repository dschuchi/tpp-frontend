import {CUSTOMERS_ENDPOINTS, ROLES_ENDPOINTS} from "@/api/endpoints"
import http from "@/api/http"
import type {Customer, Customers} from "@/types/customers.types.ts";

export const useCustomersStore = defineStore('customers', {
  state: (): Customers => ({
    customers: [],
  }),
  getters: {

  },
  actions: {
    async getCustomers() {
      const response: Customers = await http.get(CUSTOMERS_ENDPOINTS.CUSTOMERS)
      this.customers = response.customers
    },
    async getCustomer(id: number) {
      let customer: Customer = this.customers.find(c => c.id === id)

      if (customer) return customer

      customer = await http.get(CUSTOMERS_ENDPOINTS.CUSTOMER_BY_ID(id))

      if (customer) this.customers.push(customer)

      return customer
    },
    async createCustomer(customer: Customer) {
      await http.post(CUSTOMERS_ENDPOINTS.CUSTOMER, customer)
    },
    async updateCustomer(id: number, customer: Customer) {
      await http.put(CUSTOMERS_ENDPOINTS.CUSTOMER_BY_ID(id), customer)
    },
    async deactivateCustomer(id: number) {
      await http.delete(CUSTOMERS_ENDPOINTS.CUSTOMER_BY_ID(id))
      this.getCustomers()
    },
    async activateCustomer(id: number) {
      await http.patch(CUSTOMERS_ENDPOINTS.ACTIVATE_CUSTOMER_BY_ID(id))
      this.getCustomers()
    },
  }
})
