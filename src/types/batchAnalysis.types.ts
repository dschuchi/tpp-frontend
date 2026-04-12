export interface BatchAnalysis {
  id?: number
  batch_id: number
  analyzed_at: string
  quantity_analyzed: number
  quantity_available: number
  quantity_used: number
  quantity_quarantined: number
  quantity_rejected: number
  status_id?: number | null
}

export interface BatchAnalysisState {
  batchAnalyses: BatchAnalysis[]
}

export interface BatchAnalysesResponse {
  batchAnalyses: BatchAnalysis[]
  total: number
}
