import { BATCHS_ENDPOINTS } from "@/api/endpoints"
import http from "@/api/http"
import type { Batch, BatchsState, BatchsResponse } from "@/types/batchs.types"

export const useBatchsStore = defineStore('batchs', {
  state: (): BatchsState => ({
    batchs: []
  }),

  actions: {
    async getBatchs(page: number, limit: number): Promise<BatchsResponse> {
      const response: BatchsResponse = await http.get(BATCHS_ENDPOINTS.BATCHS, {
        params: { page, limit }
      })
      this.batchs = response.batches
      return response
    },
    async create(batch: Batch) {
      await http.post(BATCHS_ENDPOINTS.BATCH, batch)
    },
    async update(id: number, batch: Partial<Batch>) {
      await http.put(BATCHS_ENDPOINTS.BATCH_BY_ID(id), batch)
    },
    async getBatch(id: number): Promise<Batch> {
      return await http.get(BATCHS_ENDPOINTS.BATCH_BY_ID(id))
    },
    async deactivate(id: number) {
      await http.delete(BATCHS_ENDPOINTS.BATCH_BY_ID(id))
    },
    async activate(id: number) {
      await http.patch(`${BATCHS_ENDPOINTS.BATCH_BY_ID(id)}/activate`)
    }
  }
})
