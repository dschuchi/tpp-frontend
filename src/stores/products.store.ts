import { PRODUCTS_ENDPOINTS } from '@/api/endpoints'
import http from '@/api/http'
import type { Product, Products } from '@/types/products.types'

export const useProductsStore = defineStore('products', {
  state: (): Products => ({
    products: []
  }),

  actions: {
    async getProducts() {
      const response: Products = await http.get(PRODUCTS_ENDPOINTS.PRODUCTS)
      this.products = response.products
    },
    async getProduct(id: number) {
      return await http.get(PRODUCTS_ENDPOINTS.PRODUCT_BY_ID(id))
    },
    async create(product: Product) {
      await http.post(PRODUCTS_ENDPOINTS.PRODUCT, product)
      this.getProducts()
    },
    async update(id: number, product: Product) {
      await http.put(PRODUCTS_ENDPOINTS.PRODUCT_BY_ID(id), product)
      this.getProducts()
    },
    async deactivate(id: number) {
      await http.delete(PRODUCTS_ENDPOINTS.PRODUCT_BY_ID(id))
      this.getProducts()
    },
    async activate(id: number) {
      await http.patch(PRODUCTS_ENDPOINTS.ACTIVATE_PRODUCT_BY_ID(id))
      this.getProducts()
    }
  }
})
