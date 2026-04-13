import { PRODUCT_ORDERS_ENDPOINTS } from '@/api/endpoints'
import http from '@/api/http'
import type {
  ProductOrder,
  ProductOrderDetail,
  ProductOrderItem,
  ProductOrderStatus,
  ProductOrdersResponse
} from '@/types/productOrders.types'

export const useProductOrdersStore = defineStore('product-orders', {
  actions: {
    async getProductOrders(page: number, limit: number, filters?: Record<string, any>): Promise<ProductOrdersResponse> {
      return await http.get(PRODUCT_ORDERS_ENDPOINTS.PRODUCT_ORDERS, {
        params: { page, limit, ...filters }
      })
    },

    async getProductOrder(id: number): Promise<ProductOrderDetail> {
      return await http.get(PRODUCT_ORDERS_ENDPOINTS.PRODUCT_ORDER_BY_ID(id))
    },

    async create(order: ProductOrder): Promise<ProductOrder> {
      return await http.post(PRODUCT_ORDERS_ENDPOINTS.PRODUCT_ORDER, order)
    },

    async update(id: number, order: Partial<ProductOrder>): Promise<ProductOrder> {
      return await http.put(PRODUCT_ORDERS_ENDPOINTS.PRODUCT_ORDER_BY_ID(id), order)
    },

    async deactivate(id: number) {
      return await http.delete(PRODUCT_ORDERS_ENDPOINTS.PRODUCT_ORDER_BY_ID(id))
    },

    async activate(id: number) {
      return await http.patch(PRODUCT_ORDERS_ENDPOINTS.ACTIVATE_PRODUCT_ORDER_BY_ID(id))
    },

    async getStatuses(): Promise<ProductOrderStatus[]> {
      const res: any = await http.get(PRODUCT_ORDERS_ENDPOINTS.PRODUCT_ORDER_STATUSES, {
        params: { limit: 100 }
      })
      return res.productOrderStatuses ?? []
    },

    // Items (batch allocations)
    async createItem(orderId: number, item: Omit<ProductOrderItem, 'id' | 'product_order_id'>): Promise<ProductOrderItem> {
      return await http.post(PRODUCT_ORDERS_ENDPOINTS.PRODUCT_ORDER_ITEM(orderId), item)
    },

    async updateItem(orderId: number, itemId: number, item: Partial<ProductOrderItem>): Promise<ProductOrderItem> {
      return await http.put(PRODUCT_ORDERS_ENDPOINTS.PRODUCT_ORDER_ITEM_BY_ID(orderId, itemId), item)
    },

    async removeItem(orderId: number, itemId: number) {
      return await http.delete(PRODUCT_ORDERS_ENDPOINTS.PRODUCT_ORDER_ITEM_BY_ID(orderId, itemId))
    }
  }
})
