import { BATCH_ANALYSIS_ENDPOINTS } from "@/api/endpoints"
import http from "@/api/http"
import type { BatchAnalysis, BatchAnalysisState, BatchAnalysesResponse } from "@/types/batchAnalysis.types"

export const useBatchAnalysisStore = defineStore('batch-analysis', {
  state: (): BatchAnalysisState => ({
    batchAnalyses: []
  }),

  actions: {
    async getBatchAnalyses(page: number, limit: number): Promise<BatchAnalysesResponse> {
      const response: BatchAnalysesResponse = await http.get(BATCH_ANALYSIS_ENDPOINTS.BATCH_ANALYSES, {
        params: { page, limit }
      })
      this.batchAnalyses = response.batchAnalyses
      return response
    },
    async getBatchAnalysesByBatchId(batchId: number): Promise<BatchAnalysis[]> {
      return await http.get(BATCH_ANALYSIS_ENDPOINTS.BATCH_ANALYSIS_BY_BATCH_ID(batchId))
    },
    async create(batchAnalysis: BatchAnalysis) {
      await http.post(BATCH_ANALYSIS_ENDPOINTS.BATCH_ANALYSIS, batchAnalysis)
    },
    async update(id: number, batchAnalysis: Partial<BatchAnalysis>) {
      await http.put(BATCH_ANALYSIS_ENDPOINTS.BATCH_ANALYSIS_BY_ID(id), batchAnalysis)
    }
  }
})
