<template>
  <v-row>
    <v-col cols="12">
      <page-header
        :title="`Análisis del lote #${id}`"
        subtitle="Historial de análisis para este lote."
        :back-route="{ name: '/batchs/' }"
        back-text="Lotes"
      >
        <template #actions>
          <v-btn v-if="can('batchs-analysis:create')" color="primary" @click="openCreateDialog">
            Nuevo Análisis
          </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="analyses"
        :loading="loading"
        hover
      >
        <template #item.analyzed_at="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end align-center">
            <v-tooltip text="Editar" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('batchs-analysis:edit')" v-bind="props" icon variant="text" size="small" color="primary"
                  @click="openEditDialog(item)">
                  <v-icon icon="mdi-pencil" />
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <v-dialog v-model="dialog" max-width="700" persistent>
    <v-card>
      <v-card-title class="pa-4">
        {{ editingId ? 'Editar Análisis' : 'Nuevo Análisis' }}
      </v-card-title>
      <v-card-text class="pa-0">
        <batch-analysis-form ref="analysisFormRef" v-model="form" :readonly="saving" title="" />
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn @click="closeDialog" :disabled="saving">Cancelar</v-btn>
        <v-btn color="primary" @click="handleSave" :loading="saving">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import BatchAnalysisForm from '@/components/BatchAnalysisForm.vue'
import { useBatchAnalysisStore } from '@/stores/batchAnalysis.store'
import { useUserStore } from '@/stores/user.store'
import type { BatchAnalysis } from '@/types/batchAnalysis.types'
import type { DataTableHeader } from 'vuetify'

definePage({
  props: true,
  meta: {
    permission: 'batchs-analysis:view'
  }
})

const props = defineProps<{ id: string }>()
const { can } = useUserStore()
const batchAnalysisStore = useBatchAnalysisStore()

const headers: DataTableHeader[] = [
  { title: 'Fecha de análisis', key: 'analyzed_at' },
  { title: 'Analizada', key: 'quantity_analyzed' },
  { title: 'Disponible', key: 'quantity_available' },
  { title: 'Utilizada', key: 'quantity_used' },
  { title: 'Cuarentena', key: 'quantity_quarantined' },
  { title: 'Rechazada', key: 'quantity_rejected' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const analyses = ref<BatchAnalysis[]>([])
const loading = ref(true)
const dialog = ref(false)
const saving = ref(false)
const editingId = ref<number | null>(null)
const analysisFormRef = ref()

const emptyForm = (): BatchAnalysis => ({
  batch_id: Number(props.id),
  analyzed_at: '',
  quantity_analyzed: 0,
  quantity_available: 0,
  quantity_used: 0,
  quantity_quarantined: 0,
  quantity_rejected: 0
})

const form = ref<BatchAnalysis>(emptyForm())

const formatDate = (value: string | Date) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('es-AR')
}

const loadAnalyses = async () => {
  loading.value = true
  try {
    analyses.value = await batchAnalysisStore.getBatchAnalysesByBatchId(Number(props.id))
  } catch (error) {
    console.error('Error loading analyses:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadAnalyses)

const openCreateDialog = () => {
  editingId.value = null
  form.value = emptyForm()
  dialog.value = true
}

const openEditDialog = (item: BatchAnalysis) => {
  editingId.value = item.id ?? null
  form.value = {
    batch_id: item.batch_id,
    analyzed_at: item.analyzed_at ? new Date(item.analyzed_at).toISOString().split('T')[0] : '',
    quantity_analyzed: item.quantity_analyzed,
    quantity_available: item.quantity_available,
    quantity_used: item.quantity_used,
    quantity_quarantined: item.quantity_quarantined,
    quantity_rejected: item.quantity_rejected,
    status_id: item.status_id
  }
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
}

const handleSave = async () => {
  const { valid } = await analysisFormRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    const payload: BatchAnalysis = {
      ...form.value,
      analyzed_at: new Date(form.value.analyzed_at).toISOString()
    }

    if (editingId.value !== null) {
      await batchAnalysisStore.update(editingId.value, payload)
    } else {
      await batchAnalysisStore.create(payload)
    }

    closeDialog()
    await loadAnalyses()
  } catch (error) {
    console.error('Error saving analysis:', error)
  } finally {
    saving.value = false
  }
}
</script>
