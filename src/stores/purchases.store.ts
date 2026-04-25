import { PURCHASES_ENDPOINTS } from '@/api/endpoints'
import http from '@/api/http'
import type { PurchasesState, PurchasesResponse, Purchase } from '@/types/purchases.types'

export const usePurchasesStore = defineStore('purchases', {
  state: (): PurchasesState => ({
    purchases: []
  }),

  actions: {
    async getPurchases(page: number, limit: number) {
      const response: PurchasesResponse = await http.get(PURCHASES_ENDPOINTS.PURCHASES, {
        params: {
          page,
          limit
        }
      })
      this.purchases = response.purchases
      return response
    },
    async getPurchase(id: number) {
      const response: Purchase = await http.get(PURCHASES_ENDPOINTS.PURCHASE_BY_ID(id))
      return response
    },
    async create(purchase: Partial<Purchase>) {
      const response: Purchase = await http.post(PURCHASES_ENDPOINTS.PURCHASES, purchase)
      return response
    }
  }
})
