import { PRODUCTS_ENDPOINTS } from '@/api/endpoints'
import http from '@/api/http'
import type { Product, Products, ProductsResponse } from '@/types/products.types'

export const useProductsStore = defineStore('products', {
  state: (): Products => ({
    products: []
  }),

  actions: {
    async getProducts(page: number, limit: number) {
      const response: ProductsResponse = await http.get(PRODUCTS_ENDPOINTS.PRODUCTS, {
        params: {
          page,
          limit
        }
      })
      this.products = response.products
      return response
    },
    async getProduct(id: number): Promise<Product> {
      return await http.get(PRODUCTS_ENDPOINTS.PRODUCT_BY_ID(id))
    },
    async create(product: Product) {
      await http.post(PRODUCTS_ENDPOINTS.PRODUCT, product)
    },
    async update(id: number, product: Product) {
      await http.put(PRODUCTS_ENDPOINTS.PRODUCT_BY_ID(id), product)
    },
    async deactivate(id: number) {
      await http.delete(PRODUCTS_ENDPOINTS.PRODUCT_BY_ID(id))
    },
    async activate(id: number) {
      await http.patch(PRODUCTS_ENDPOINTS.ACTIVATE_PRODUCT_BY_ID(id))
    }
  }
})
