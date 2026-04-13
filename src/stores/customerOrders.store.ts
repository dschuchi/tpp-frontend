import { CUSTOMER_ORDERS_ENDPOINTS } from '@/api/endpoints'
import http from '@/api/http'
import type {
  CustomerOrder,
  CustomerOrderDetail,
  CustomerOrderItem,
  CustomerOrderStatus,
  CustomerOrdersResponse
} from '@/types/customerOrders.types'

export const useCustomerOrdersStore = defineStore('customer-orders', {
  actions: {
    async getCustomerOrders(page: number, limit: number, filters?: Record<string, any>): Promise<CustomerOrdersResponse> {
      return await http.get(CUSTOMER_ORDERS_ENDPOINTS.CUSTOMER_ORDERS, {
        params: { page, limit, ...filters }
      })
    },

    async getCustomerOrder(id: number): Promise<CustomerOrderDetail> {
      return await http.get(CUSTOMER_ORDERS_ENDPOINTS.CUSTOMER_ORDER_BY_ID(id))
    },

    async create(order: CustomerOrder): Promise<CustomerOrder> {
      return await http.post(CUSTOMER_ORDERS_ENDPOINTS.CUSTOMER_ORDER, order)
    },

    async update(id: number, order: Partial<CustomerOrder>): Promise<CustomerOrder> {
      return await http.put(CUSTOMER_ORDERS_ENDPOINTS.CUSTOMER_ORDER_BY_ID(id), order)
    },

    async deactivate(id: number) {
      return await http.delete(CUSTOMER_ORDERS_ENDPOINTS.CUSTOMER_ORDER_BY_ID(id))
    },

    async activate(id: number) {
      return await http.patch(CUSTOMER_ORDERS_ENDPOINTS.ACTIVATE_CUSTOMER_ORDER_BY_ID(id))
    },

    async getStatuses(): Promise<CustomerOrderStatus[]> {
      const res: any = await http.get(CUSTOMER_ORDERS_ENDPOINTS.CUSTOMER_ORDER_STATUSES, {
        params: { limit: 100 }
      })
      return res.customerOrderStatuses ?? []
    },

    // Items
    async createItem(orderId: number, item: Omit<CustomerOrderItem, 'id' | 'customer_order_id'>): Promise<CustomerOrderItem> {
      return await http.post(CUSTOMER_ORDERS_ENDPOINTS.CUSTOMER_ORDER_ITEM(orderId), item)
    },

    async updateItem(orderId: number, itemId: number, item: Partial<CustomerOrderItem>): Promise<CustomerOrderItem> {
      return await http.put(CUSTOMER_ORDERS_ENDPOINTS.CUSTOMER_ORDER_ITEM_BY_ID(orderId, itemId), item)
    },

    async removeItem(orderId: number, itemId: number) {
      return await http.delete(CUSTOMER_ORDERS_ENDPOINTS.CUSTOMER_ORDER_ITEM_BY_ID(orderId, itemId))
    }
  }
})
