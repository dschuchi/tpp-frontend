<template>
  <v-row>
    <v-col cols="12">
      <page-header
        :title="`Pedido de Cliente #${id}`"
        subtitle="Detalle del pedido y productos incluidos."
        :back-route="{ name: '/customer-orders/' }"
        back-text="Pedidos de Clientes"
      >
        <template #actions>
          <v-btn
            v-if="order && !editingHeader"
            icon variant="text"
            color="primary"
            @click="startEditHeader"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <template v-if="editingHeader">
            <v-btn @click="cancelEditHeader" :disabled="savingHeader">Cancelar</v-btn>
            <v-btn color="primary" @click="saveHeader" :loading="savingHeader">Guardar cambios</v-btn>
          </template>
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
            <span>Datos del pedido</span>
            <v-chip v-if="order.status" size="small" color="primary" variant="tonal">{{ order.status }}</v-chip>
            <status-chip :value="order.is_active" />
          </v-card-title>
          <v-card-text>
            <v-form ref="headerFormRef" v-if="editingHeader">
              <v-row>
                <v-col cols="12" md="6">
                  <customer-selector v-model="headerForm.customer_id" />
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
                <v-col cols="6" md="3">
                  <v-text-field v-model="headerForm.total" label="Total" prefix="$" />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field v-model="headerForm.tax" label="Impuesto (%)" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="headerForm.estimated_date" label="Fecha estimada" type="date" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="headerForm.presentation" label="Presentación" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="headerForm.package_detail" label="Detalle de empaque" />
                </v-col>
                <v-col cols="12" md="6" class="d-flex align-center">
                  <v-checkbox v-model="headerForm.inputs_provided_by_customer" label="Insumos provistos por el cliente" />
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="headerForm.observations" label="Observaciones" rows="2" />
                </v-col>
              </v-row>
            </v-form>

            <v-row v-else>
              <v-col cols="12" sm="6" md="3">
                <div class="text-caption text-medium-emphasis">Cliente</div>
                <div>{{ order.customer_name ?? `#${order.customer_id}` }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="text-caption text-medium-emphasis">Total</div>
                <div>$ {{ order.total }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="text-caption text-medium-emphasis">Impuesto</div>
                <div>{{ order.tax ? `${order.tax}%` : '-' }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="text-caption text-medium-emphasis">Fecha estimada</div>
                <div>{{ order.estimated_date ? formatDate(order.estimated_date) : '-' }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <div class="text-caption text-medium-emphasis">Presentación</div>
                <div>{{ order.presentation || '-' }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <div class="text-caption text-medium-emphasis">Detalle de empaque</div>
                <div>{{ order.package_detail || '-' }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <div class="text-caption text-medium-emphasis">Insumos por cliente</div>
                <div>{{ order.inputs_provided_by_customer ? 'Sí' : 'No' }}</div>
              </v-col>
              <v-col cols="12" v-if="order.observations">
                <div class="text-caption text-medium-emphasis">Observaciones</div>
                <div>{{ order.observations }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12">
        <v-card>
          <v-card-title class="pa-4 d-flex align-center justify-space-between">
            <span>Productos del pedido</span>
            <v-btn
              v-if="can('customer-orders:create')"
              color="primary"
              size="small"
              prepend-icon="mdi-plus"
              @click="openAddItemDialog"
            >
              Agregar producto
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-data-table
              :headers="itemHeaders"
              :items="order.customer_order_items"
              hover
            >
              <template #item.product_id="{ item }">
                {{ item.product_name ?? `Producto #${item.product_id}` }}
              </template>
              <template #item.unit_price="{ value }">
                $ {{ value }}
              </template>
              <template #item.actions="{ item }">
                <div class="d-flex ga-2 justify-end align-center">
                  <v-tooltip text="Editar" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-if="can('customer-orders:edit')"
                        v-bind="props"
                        icon variant="text" size="small" color="primary"
                        @click="openEditItemDialog(item)"
                      >
                        <v-icon icon="mdi-pencil" />
                      </v-btn>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Quitar" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-if="can('customer-orders:delete')"
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

  <v-dialog v-model="itemDialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="pa-4">
        {{ editingItemId ? 'Editar producto' : 'Agregar producto' }}
      </v-card-title>
      <v-card-text>
        <v-form ref="itemFormRef">
          <v-row>
            <v-col cols="12">
              <paginated-select
                v-model="itemForm.product_id"
                label="Producto"
                item-title="name"
                :load-fn="loadProducts"
                :fetch-by-id-fn="(id) => productsStore.getProduct(Number(id))"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="itemForm.unit_price"
                label="Precio unitario"
                prefix="$"
                :rules="[v => !!v || 'Requerido']"
                :readonly="savingItem"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="itemForm.quantity"
                label="Cantidad"
                type="number"
                :rules="[v => !!v || 'Requerido', v => v > 0 || 'Debe ser mayor a 0']"
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
import CustomerSelector from '@/components/CustomerSelector.vue'
import PaginatedSelect from '@/components/PaginatedSelect.vue'
import { useCustomerOrdersStore } from '@/stores/customerOrders.store'
import { useProductsStore } from '@/stores/products.store'
import { useUserStore } from '@/stores/user.store'
import { useCustomersStore } from '@/stores/customers.store'
import { useConfirm } from '@/composables/useConfirm'
import type { CustomerOrderDetail, CustomerOrderItem } from '@/types/customerOrders.types'
import type { DataTableHeader } from 'vuetify'

definePage({
  props: true,
  meta: {
    permission: 'customer-orders:view'
  }
})

const props = defineProps<{ id: string }>()
const { can } = useUserStore()
const ordersStore = useCustomerOrdersStore()
const productsStore = useProductsStore()
const customersStore = useCustomersStore()
const { confirm } = useConfirm()

const order = ref<CustomerOrderDetail | null>(null)
const loading = ref(true)
const statuses = ref<any[]>([])

const editingHeader = ref(false)
const savingHeader = ref(false)
const headerFormRef = ref()
const headerForm = ref<any>({})

const itemDialog = ref(false)
const savingItem = ref(false)
const editingItemId = ref<number | null>(null)
const itemFormRef = ref()
const itemForm = ref<any>({ product_id: null, unit_price: '', quantity: 0 })

const itemHeaders: DataTableHeader[] = [
  { title: 'Producto', key: 'product_id' },
  { title: 'Precio unitario', key: 'unit_price' },
  { title: 'Cantidad', key: 'quantity' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const formatDate = (value: string) => new Date(value).toLocaleDateString('es-AR')

const loadProducts = async (page: number, search: string) => {
  const res = await productsStore.getProducts(page, 5)
  return { items: res.products, total: res.total }
}

const loadOrder = async () => {
  loading.value = true
  try {
    const data = await ordersStore.getCustomerOrder(Number(props.id))
    const customer = data.customer_id ? await customersStore.getCustomer(data.customer_id) : null

    // Enrich items with product names
    const enrichedItems = await Promise.all(
      (data.customer_order_items ?? []).map(async (item) => {
        if (!item.product_id) return item
        const product = await productsStore.getProduct(item.product_id)
        return { ...item, product_name: product?.name ?? null }
      })
    )

    order.value = { ...data, customer_name: customer?.name ?? null, customer_order_items: enrichedItems }
  } catch (error) {
    console.error('Error cargando pedido:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadOrder()
  statuses.value = await ordersStore.getStatuses()
})

const startEditHeader = () => {
  headerForm.value = {
    customer_id: order.value?.customer_id,
    status_id: order.value?.status_id,
    total: order.value?.total,
    tax: order.value?.tax,
    estimated_date: order.value?.estimated_date ? new Date(order.value.estimated_date).toISOString().split('T')[0] : null,
    presentation: order.value?.presentation,
    package_detail: order.value?.package_detail,
    inputs_provided_by_customer: order.value?.inputs_provided_by_customer ?? false,
    observations: order.value?.observations
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
      estimated_date: headerForm.value.estimated_date ? new Date(headerForm.value.estimated_date).toISOString() : null
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
  itemForm.value = { product_id: null, unit_price: '', quantity: 1 }
  itemDialog.value = true
}

const openEditItemDialog = (item: CustomerOrderItem) => {
  editingItemId.value = item.id ?? null
  itemForm.value = { product_id: item.product_id, unit_price: item.unit_price, quantity: item.quantity }
  itemDialog.value = true
}

const closeItemDialog = () => {
  itemDialog.value = false
}

const handleSaveItem = async () => {
  const { valid } = await itemFormRef.value.validate()
  if (!valid) return

  savingItem.value = true
  try {
    if (editingItemId.value) {
      await ordersStore.updateItem(Number(props.id), editingItemId.value, itemForm.value)
    } else {
      await ordersStore.createItem(Number(props.id), itemForm.value)
    }
    closeItemDialog()
    await loadOrder()
  } catch (error) {
    console.error('Error guardando ítem:', error)
  } finally {
    savingItem.value = false
  }
}

const removeItem = async (item: CustomerOrderItem) => {
  const ok = await confirm({
    title: 'Quitar producto',
    message: '¿Estás seguro de que querés quitar este producto del pedido?',
    confirmText: 'Quitar',
    confirmColor: 'error'
  })
  if (ok && item.id) {
    await ordersStore.removeItem(Number(props.id), item.id)
    await loadOrder()
  }
}
</script>
