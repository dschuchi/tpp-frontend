<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Pedidos de Clientes" subtitle="Administra los pedidos de clientes.">
        <template #actions>
          <v-btn v-if="can('customer-orders:create')" to="/customer-orders/new" color="primary">
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
        <template #item.customer_id="{ item }">
          {{ item.customer_name ?? `Cliente #${item.customer_id}` }}
        </template>
        <template #item.estimated_date="{ value }">
          {{ value ? formatDate(value) : '-' }}
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
            <v-tooltip text="Ver detalle" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-if="can('customer-orders:view')"
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
                  v-if="can('customer-orders:delete')"
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
import { useCustomerOrdersStore } from '@/stores/customerOrders.store'
import { useCustomersStore } from '@/stores/customers.store'
import { useUserStore } from '@/stores/user.store'
import { useConfirm } from '@/composables/useConfirm'
import type { CustomerOrder } from '@/types/customerOrders.types'
import type { DataTableHeader } from 'vuetify'
import type { DataTableOptions } from '@/types/table.types'

definePage({
  meta: {
    permission: 'customer-orders:view'
  }
})

const { can } = useUserStore()
const ordersStore = useCustomerOrdersStore()
const customersStore = useCustomersStore()
const router = useRouter()
const { confirm } = useConfirm()

const headers: DataTableHeader[] = [
  { title: 'Cliente', key: 'customer_id' },
  { title: 'Total', key: 'total' },
  { title: 'Estado', key: 'status' },
  { title: 'Fecha estimada', key: 'estimated_date' },
  { title: 'Activo', key: 'is_active' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const orders = ref<CustomerOrder[]>([])
const loading = ref(true)
const totalItems = ref(0)
const itemsPerPage = ref(10)

const formatDate = (value: string) => new Date(value).toLocaleDateString('es-AR')

const goToDetail = (id: any) => router.push({ name: '/customer-orders/[id]/', params: { id } })

const toggleStatus = async (item: CustomerOrder) => {
  const isDeactivating = item.is_active
  const ok = await confirm({
    title: isDeactivating ? 'Desactivar pedido' : 'Activar pedido',
    message: `¿Estás seguro de que querés ${isDeactivating ? 'desactivar' : 'activar'} este pedido?`,
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
    const response = await ordersStore.getCustomerOrders(page, limit)
    const rawOrders = response.customerOrders ?? []

    orders.value = await Promise.all(rawOrders.map(async (order) => {
      const customer = order.customer_id
        ? await customersStore.getCustomer(order.customer_id)
        : null
      return { ...order, customer_name: customer?.name ?? '-' }
    }))

    totalItems.value = response.total
  } catch (error) {
    console.error('Error cargando pedidos:', error)
  } finally {
    loading.value = false
  }
}
</script>
