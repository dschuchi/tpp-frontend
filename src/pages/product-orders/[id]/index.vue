<template>
  <v-row>
    <v-col cols="12">
      <page-header
        :title="`Orden de Producción #${id}`"
        :back-route="{ name: '/product-orders/' }"
        back-text="Orden de Producción"
      >
        <template #actions>
          <template v-if="editingHeader">
            <v-btn @click="cancelEditHeader" :disabled="savingHeader">Cancelar</v-btn>
            <v-btn color="primary" @click="saveHeader" :loading="savingHeader">Guardar cambios</v-btn>
          </template>
          <v-btn v-else-if="order" icon variant="text" color="primary" @click="startEditHeader">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row v-if="loading">
    <v-col class="d-flex justify-center"><v-progress-circular indeterminate /></v-col>
  </v-row>

  <template v-else-if="order">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="pa-4 d-flex align-center ga-2">
            <span>Datos de la orden</span>
            <v-chip v-if="order.status" size="small" color="primary" variant="tonal">{{ order.status }}</v-chip>
            <status-chip :value="order.is_active" />
          </v-card-title>
          <v-card-text>
            <v-form ref="headerFormRef" v-if="editingHeader">
              <v-row>
                <v-col cols="12" md="6">
                  <paginated-select
                    v-model="headerForm.product_id"
                    label="Producto"
                    item-title="name"
                    :load-fn="loadProducts"
                    :fetch-by-id-fn="(id) => productsStore.getProduct(Number(id))"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="headerForm.status_id"
                    :items="statuses"
                    item-title="name"
                    item-value="id"
                    label="Estado"
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="headerForm.quantity"
                    label="Cantidad a producir"
                    type="number"
                    :rules="[v => v > 0 || 'Debe ser mayor a 0']"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="headerForm.customer_order_id"
                    label="N° Orden de cliente (opcional)"
                    type="number"
                  />
                </v-col>
              </v-row>
            </v-form>

            <v-row v-else>
              <v-col cols="6" md="3">
                <div class="text-caption text-medium-emphasis">Producto</div>
                <div class="font-weight-medium">{{ order.product_name ?? `#${order.product_id}` }}</div>
              </v-col>
              <v-col cols="6" md="3">
                <div class="text-caption text-medium-emphasis">Cantidad a producir</div>
                <div class="font-weight-medium text-h6">{{ order.quantity }}</div>
              </v-col>
              <v-col cols="6" md="3">
                <div class="text-caption text-medium-emphasis">Orden de Pedido</div>
                <div>
                  <router-link
                    v-if="order.customer_order_id"
                    :to="{ name: '/customer-orders/[id]/', params: { id: order.customer_order_id } }"
                    class="text-primary"
                  >
                    Pedido #{{ order.customer_order_id }}
                  </router-link>
                  <span v-else class="text-medium-emphasis">—</span>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="order.recipe && order.recipe.items.length > 0" class="mt-2">
      <v-col cols="12">
        <v-card>
          <v-card-title class="pa-4 d-flex align-center ga-2">
            <v-icon color="secondary" class="mr-1">mdi-flask-outline</v-icon>
            Fórmula del producto
          </v-card-title>
          <v-card-text class="pa-0">
            <v-data-table
              :headers="recipeHeaders"
              :items="recipeWithTotals"
              density="compact"
              hide-default-footer
            >
              <template #item.total_needed="{ item }">
                <span class="font-weight-medium">{{ item.total_needed }} {{ item.unit }}</span>
              </template>
              <template #item.is_active="{ value }">
                <v-icon :color="value ? 'success' : 'error'" size="small">
                  {{ value ? 'mdi-check-circle' : 'mdi-close-circle' }}
                </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12">
        <v-card>
          <v-card-title class="pa-4 d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-2">
              <v-icon color="primary">mdi-package-variant</v-icon>
              <span>Lotes asignados</span>
              <v-chip size="small" variant="tonal" :color="allocationStatus.color">
                {{ allocationStatus.label }}
              </v-chip>
            </div>
            <v-btn
              v-if="can('product-orders:create')"
              color="primary"
              size="small"
              prepend-icon="mdi-plus"
              @click="openAddItemDialog"
            >
              Agregar lote
            </v-btn>
          </v-card-title>

          <v-card-text v-if="allocationSummary.length > 0" class="pb-0">
            <div class="text-caption text-medium-emphasis mb-2">Cantidad total necesaria por materia prima:</div>
            <v-row dense>
              <v-col
                v-for="summary in allocationSummary"
                :key="summary.raw_material_id"
                cols="12" sm="6" md="4"
              >
                <v-card variant="tonal" color="secondary" class="pa-3">
                  <div class="text-caption font-weight-bold">{{ summary.raw_material_name }}</div>
                  <div class="d-flex justify-space-between align-center mt-1">
                    <span class="text-caption text-medium-emphasis">Total necesario:</span>
                    <span class="text-body-2 font-weight-medium">{{ summary.needed }} {{ summary.unit }}</span>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <v-alert type="info" variant="tonal" density="compact" class="mt-3 text-caption">
              Asigná los análisis de lote correspondientes a cada materia prima. Si un lote no alcanza, podés agregar múltiples análisis.
            </v-alert>
            <v-divider class="mt-3" />
          </v-card-text>

          <v-card-text class="pa-0">
            <v-data-table
              :headers="itemHeaders"
              :items="enrichedItems"
              :loading="loadingAnalyses"
              hover
            >
              <template #item.batch_analysis_id="{ item }">
                <span class="font-weight-medium">Análisis #{{ item.batch_analysis_id }}</span>
                <span v-if="item.batch_id" class="text-caption text-medium-emphasis ml-1">
                  (Lote #{{ item.batch_id }})
                </span>
              </template>
              <template #item.quantity_available="{ item }">
                <span v-if="item.quantity_available !== undefined" :class="item.quantity_available < item.quantity ? 'text-error' : ''">
                  {{ item.quantity_available }}
                </span>
                <span v-else class="text-medium-emphasis">—</span>
              </template>
              <template #item.quantity="{ value }">
                <span class="font-weight-medium text-primary">{{ value }}</span>
              </template>
              <template #item.actions="{ item }">
                <div class="d-flex ga-2 justify-end align-center">
                  <v-tooltip text="Editar cantidad" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-if="can('product-orders:edit')"
                        v-bind="props"
                        icon variant="text" size="small" color="primary"
                        @click="openEditItemDialog(item)"
                      >
                        <v-icon icon="mdi-pencil" />
                      </v-btn>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Quitar lote" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-if="can('product-orders:delete')"
                        v-bind="props"
                        icon variant="text" size="small" color="error"
                        @click="removeItem(item)"
                      >
                        <v-icon icon="mdi-delete" />
                      </v-btn>
                    </template>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </template>

  <v-dialog v-model="itemDialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="pa-4">
        {{ editingItemId ? 'Editar lote asignado' : 'Asignar lote de análisis' }}
      </v-card-title>
      <v-card-text>
        <v-alert v-if="!editingItemId" type="info" variant="tonal" class="mb-4" density="compact">
          Seleccioná un análisis de lote para asignar materia prima a este pedido de producción.
          Si necesitás más de un lote para una misma materia prima, podés agregar varios análisis.
        </v-alert>
        <v-form ref="itemFormRef">
          <v-row>
            <v-col cols="12" v-if="!editingItemId">
              <v-autocomplete
                v-model="itemForm.batch_analysis_id"
                :items="batchAnalysisOptions"
                item-title="label"
                item-value="id"
                label="Análisis de lote *"
                :rules="[v => !!v || 'Requerido']"
                :loading="loadingAnalyses"
                no-data-text="No hay análisis disponibles"
                :readonly="savingItem"
              >
                <template #item="{ props: itemProps, item }">
                  <v-list-item v-bind="itemProps">
                    <template #title>
                      <span class="font-weight-medium">Análisis #{{ item.raw.id }}</span>
                      <span class="text-caption ml-2 text-medium-emphasis">Lote #{{ item.raw.batch_id }}</span>
                    </template>
                    <template #subtitle>
                      <span>Disponible: <strong>{{ item.raw.quantity_available }}</strong></span>
                      <span class="ml-3">Fecha: {{ item.raw.analyzed_at ? new Date(item.raw.analyzed_at).toLocaleDateString('es-AR') : '—' }}</span>
                    </template>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" v-else>
              <v-alert type="info" variant="tonal" density="compact">
                Análisis #{{ itemForm.batch_analysis_id }}
                <span v-if="selectedAnalysis"> — Lote #{{ selectedAnalysis.batch_id }} — Disponible: {{ selectedAnalysis.quantity_available }}</span>
              </v-alert>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="itemForm.quantity"
                label="Cantidad a usar *"
                type="number"
                :rules="[
                  v => !!v || 'Requerido',
                  v => v > 0 || 'Debe ser mayor a 0',
                  v => !selectedAnalysis || v <= selectedAnalysis.quantity_available || `No puede superar la cantidad disponible (${selectedAnalysis.quantity_available})`
                ]"
                :hint="selectedAnalysis ? `Disponible en este análisis: ${selectedAnalysis.quantity_available}` : ''"
                persistent-hint
                :readonly="savingItem"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn @click="closeItemDialog" :disabled="savingItem">Cancelar</v-btn>
        <v-btn color="primary" @click="handleSaveItem" :loading="savingItem">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue'
import PaginatedSelect from '@/components/PaginatedSelect.vue'
import { useProductOrdersStore } from '@/stores/productOrders.store'
import { useProductsStore } from '@/stores/products.store'
import { useBatchAnalysisStore } from '@/stores/batchAnalysis.store'
import { useUserStore } from '@/stores/user.store'
import { useConfirm } from '@/composables/useConfirm'
import type { ProductOrderDetail, ProductOrderItem } from '@/types/productOrders.types'
import type { BatchAnalysis } from '@/types/batchAnalysis.types'
import type { DataTableHeader } from 'vuetify'

definePage({
  props: true,
  meta: {
    permission: 'product-orders:view'
  }
})

const props = defineProps<{ id: string }>()
const { can } = useUserStore()
const ordersStore = useProductOrdersStore()
const productsStore = useProductsStore()
const batchAnalysisStore = useBatchAnalysisStore()
const { confirm } = useConfirm()

const order = ref<ProductOrderDetail | null>(null)
const loading = ref(true)
const statuses = ref<any[]>([])
const allAnalyses = ref<BatchAnalysis[]>([])
const loadingAnalyses = ref(false)

const editingHeader = ref(false)
const savingHeader = ref(false)
const headerFormRef = ref()
const headerForm = ref<any>({})

const itemDialog = ref(false)
const savingItem = ref(false)
const editingItemId = ref<number | null>(null)
const itemFormRef = ref()
const itemForm = ref<{ batch_analysis_id: number | null; quantity: number }>({
  batch_analysis_id: null,
  quantity: 0
})

const recipeHeaders: DataTableHeader[] = [
  { title: 'Materia Prima', key: 'raw_material_name' },
  { title: 'Cant. por fórmula', key: 'quantity' },
  { title: 'Unidad', key: 'unit' },
  { title: 'Total necesario', key: 'total_needed' },
  { title: 'Activo', key: 'is_active', sortable: false }
]

const itemHeaders: DataTableHeader[] = [
  { title: 'Análisis de lote', key: 'batch_analysis_id' },
  { title: 'Disponible en análisis', key: 'quantity_available' },
  { title: 'Cantidad asignada', key: 'quantity' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const recipeWithTotals = computed(() => {
  if (!order.value?.recipe?.items) return []
  return order.value.recipe.items.map(item => ({
    ...item,
    total_needed: (item.quantity * (order.value?.quantity ?? 1)).toFixed(3).replace(/\.?0+$/, '')
  }))
})

const batchAnalysisOptions = computed(() =>
  allAnalyses.value.map(a => ({
    ...a,
    label: `Análisis #${a.id} — Lote #${a.batch_id} — Disponible: ${a.quantity_available}`
  }))
)

const enrichedItems = computed(() => {
  if (!order.value?.product_order_items) return []
  return order.value.product_order_items.map(item => {
    const analysis = allAnalyses.value.find(a => a.id === item.batch_analysis_id)
    return {
      ...item,
      batch_id: analysis?.batch_id ?? null,
      quantity_available: analysis?.quantity_available
    }
  })
})

const selectedAnalysis = computed(() =>
  itemForm.value.batch_analysis_id
    ? allAnalyses.value.find(a => a.id === itemForm.value.batch_analysis_id) ?? null
    : null
)

// Allocation summary: shows recipe needs vs total allocated per order item count
const allocationSummary = computed(() => {
  if (!order.value?.recipe?.items) return []
  const qty = order.value.quantity
  return order.value.recipe.items
    .filter(ri => ri.is_active)
    .map(ri => ({
      raw_material_id: ri.raw_material_id,
      raw_material_name: ri.raw_material_name ?? `Materia Prima #${ri.raw_material_id}`,
      needed: +(ri.quantity * qty).toFixed(6),
      unit: ri.unit
    }))
})

const allocationStatus = computed(() => {
  if (!order.value?.product_order_items?.length) return { color: 'warning', label: 'Sin lotes asignados' }
  return { color: 'success', label: `${order.value.product_order_items.length} lote(s) asignado(s)` }
})

const loadProducts = async (page: number, _search: string) => {
  const res = await productsStore.getProducts(page, 5)
  return { items: res.products, total: res.total }
}

const loadOrder = async () => {
  loading.value = true
  try {
    const data = await ordersStore.getProductOrder(Number(props.id))
    const product = data.product_id ? await productsStore.getProduct(data.product_id) : null
    order.value = { ...data, product_name: product?.name ?? null }
  } catch (error) {
    console.error('Error cargando pedido de producción:', error)
  } finally {
    loading.value = false
  }
}

const loadAnalyses = async () => {
  loadingAnalyses.value = true
  try {
    const res = await batchAnalysisStore.getBatchAnalyses(1, 200)
    allAnalyses.value = res.batchAnalyses ?? []
  } catch (error) {
    console.error('Error cargando análisis:', error)
  } finally {
    loadingAnalyses.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadOrder(), loadAnalyses()])
  statuses.value = await ordersStore.getStatuses()
})

const startEditHeader = () => {
  headerForm.value = {
    product_id: order.value?.product_id,
    status_id: order.value?.status_id,
    quantity: order.value?.quantity,
    customer_order_id: order.value?.customer_order_id
  }
  editingHeader.value = true
}

const cancelEditHeader = () => {
  editingHeader.value = false
}

const saveHeader = async () => {
  savingHeader.value = true
  try {
    await ordersStore.update(Number(props.id), {
      ...headerForm.value,
      customer_order_id: headerForm.value.customer_order_id || null
    })
    editingHeader.value = false
    await loadOrder()
  } catch (error) {
    console.error('Error guardando:', error)
  } finally {
    savingHeader.value = false
  }
}

const openAddItemDialog = () => {
  editingItemId.value = null
  itemForm.value = { batch_analysis_id: null, quantity: 0 }
  itemDialog.value = true
}

const openEditItemDialog = (item: any) => {
  editingItemId.value = item.id ?? null
  itemForm.value = { batch_analysis_id: item.batch_analysis_id, quantity: item.quantity }
  itemDialog.value = true
}

const closeItemDialog = () => {
  itemDialog.value = false
}

const handleSaveItem = async () => {
  const { valid } = await itemFormRef.value.validate()
  if (!valid || !itemForm.value.batch_analysis_id) return

  savingItem.value = true
  try {
    if (editingItemId.value) {
      await ordersStore.updateItem(Number(props.id), editingItemId.value, {
        batch_analysis_id: itemForm.value.batch_analysis_id,
        quantity: itemForm.value.quantity
      })
    } else {
      await ordersStore.createItem(Number(props.id), {
        batch_analysis_id: itemForm.value.batch_analysis_id!,
        quantity: itemForm.value.quantity
      })
    }
    closeItemDialog()
    await loadOrder()
  } catch (error) {
    console.error('Error guardando lote:', error)
  } finally {
    savingItem.value = false
  }
}

const removeItem = async (item: ProductOrderItem) => {
  const ok = await confirm({
    title: 'Quitar lote asignado',
    message: `¿Estás seguro de que querés quitar el Análisis #${item.batch_analysis_id} de este pedido?`,
    confirmText: 'Quitar',
    confirmColor: 'error'
  })
  if (ok && item.id) {
    await ordersStore.removeItem(Number(props.id), item.id)
    await loadOrder()
  }
}
</script>
