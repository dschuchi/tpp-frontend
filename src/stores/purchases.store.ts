import type { PurchaseDTO, PurchaseListResponseDTO } from '@/api/dtos/purchase.dto'
import { PURCHASES_ENDPOINTS } from '@/api/endpoints'
import http from '@/api/http'
import { purchaseMapper } from '@/mappers/purchase.mapper'
import type { Purchase } from '@/models/purchase.model'
import type { PaginatedList } from '@/types/pagination.types'


export const usePurchasesStore = defineStore('purchases', {
  state: () => ({
    purchases: []
  }),

  actions: {
    async getPurchases(page: number, limit: number): Promise<PaginatedList<Purchase>> {
      const response: PurchaseListResponseDTO = await http.get(PURCHASES_ENDPOINTS.PURCHASES, {
        params: {
          page,
          limit
        }
      })
      const purchases = response.purchases.map(purchaseMapper.toModel)
      const purchasesPaginated: PaginatedList<Purchase> = {
        total: response.total,
        items: purchases
      }
      return purchasesPaginated
    },
    async getPurchase(id: number) {
      const response: PurchaseDTO = await http.get(PURCHASES_ENDPOINTS.PURCHASE_BY_ID(id))
      return purchaseMapper.toModel(response)
    },
    async create(purchase: Partial<Purchase>) {
      try {
        const payload = purchaseMapper.toCreateDTO(purchase);

        const { data } = await http.post<PurchaseDTO>(PURCHASES_ENDPOINTS.PURCHASES, payload);
      } catch (error) {
        console.error("Error creando la compra:", error);
        throw error;
      }
    },
    async update(id: number, purchase: Partial<Purchase>) {
      const response: PurchaseDTO = await http.put(PURCHASES_ENDPOINTS.PURCHASE_BY_ID(id), purchase)
      return purchaseMapper.toModel(response)
    }
  }
})
