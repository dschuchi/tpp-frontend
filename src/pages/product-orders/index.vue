<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Pedidos de Producción" subtitle="Administra los pedidos de producción.">
        <template #actions>
          <v-btn v-if="can('product-orders:create')" to="/product-orders/new" color="primary">
            Nuevo Pedido
          </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-data-table-server
        :headers="headers"
        :items="orders"
        :items-length="totalItems"
        :items-per-page="itemsPerPage"
        :loading="loading"
        hover
        @update:options="loadItems"
      >
        <template #item.product_id="{ item }">
          {{ item.product_name ?? `Producto #${item.product_id}` }}
        </template>
        <template #item.customer_order_id="{ value }">
          <span v-if="value" class="text-primary">Pedido #{{ value }}</span>
          <span v-else class="text-medium-emphasis">—</span>
        </template>
        <template #item.status="{ item }">
          <v-chip v-if="item.status" size="small" color="primary" variant="tonal">{{ item.status }}</v-chip>
          <span v-else class="text-medium-emphasis">—</span>
        </template>
        <template #item.is_active="{ value }">
          <status-chip :value="value" />
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end align-center">
            <v-tooltip text="Ver detalle y lotes" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-if="can('product-orders:view')"
                  v-bind="props"
                  icon variant="text" size="small" color="primary"
                  @click="goToDetail(item.id)"
                >
                  <v-icon icon="mdi-eye" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip :text="item.is_active ? 'Desactivar' : 'Restaurar'" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-if="can('product-orders:delete')"
                  v-bind="props"
                  icon variant="text" size="small"
                  :color="item.is_active ? 'error' : 'success'"
                  @click="toggleStatus(item)"
                >
                  <v-icon :icon="item.is_active ? 'mdi-delete' : 'mdi-delete-restore'" />
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table-server>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue'
import { useProductOrdersStore } from '@/stores/productOrders.store'
import { useProductsStore } from '@/stores/products.store'
import { useUserStore } from '@/stores/user.store'
import { useConfirm } from '@/composables/useConfirm'
import type { ProductOrder } from '@/types/productOrders.types'
import type { DataTableHeader } from 'vuetify'
import type { DataTableOptions } from '@/types/table.types'

definePage({
  meta: {
    permission: 'product-orders:view'
  }
})

const { can } = useUserStore()
const ordersStore = useProductOrdersStore()
const productsStore = useProductsStore()
const router = useRouter()
const { confirm } = useConfirm()

const headers: DataTableHeader[] = [
  { title: 'Producto', key: 'product_id' },
  { title: 'Cantidad a producir', key: 'quantity' },
  { title: 'Estado', key: 'status' },
  { title: 'Pedido de cliente', key: 'customer_order_id' },
  { title: 'Activo', key: 'is_active' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const orders = ref<ProductOrder[]>([])
const loading = ref(true)
const totalItems = ref(0)
const itemsPerPage = ref(10)

const goToDetail = (id: any) => router.push({ name: '/product-orders/[id]/', params: { id } })

const toggleStatus = async (item: ProductOrder) => {
  const isDeactivating = item.is_active
  const ok = await confirm({
    title: isDeactivating ? 'Desactivar pedido' : 'Activar pedido',
    message: `¿Estás seguro de que querés ${isDeactivating ? 'desactivar' : 'activar'} este pedido de producción?`,
    confirmText: isDeactivating ? 'Desactivar' : 'Activar',
    confirmColor: isDeactivating ? 'error' : 'success'
  })
  if (ok && item.id) {
    isDeactivating ? await ordersStore.deactivate(item.id) : await ordersStore.activate(item.id)
    item.is_active = !item.is_active
  }
}

const loadItems = async ({ page, itemsPerPage: limit }: DataTableOptions) => {
  loading.value = true
  try {
    const response = await ordersStore.getProductOrders(page, limit)
    const rawOrders = response.productOrders ?? []

    orders.value = await Promise.all(rawOrders.map(async (order) => {
      const product = order.product_id
        ? await productsStore.getProduct(order.product_id)
        : null
      return { ...order, product_name: product?.name ?? null }
    }))

    totalItems.value = response.total
  } catch (error) {
    console.error('Error cargando pedidos de producción:', error)
  } finally {
    loading.value = false
  }
}
</script>
