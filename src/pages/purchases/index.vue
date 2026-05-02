<template>
  <v-row>
    <v-col cols="12">
      <page-header
        title="Compras"
        subtitle="Administra las compras de materias primas e insumos."
      >
        <template #actions>
          <v-btn
            v-if="can('purchases:create')"
            to="/purchases/new"
          >
            Nueva Compra
          </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-data-table-server
        :headers="headers"
        v-model:items-per-page="itemsPerPage"
        :items="purchases"
        :items-length="totalItems"
        :loading="loading"
        hover
        @update:options="loadItems"
      >
        <template #item.scheduled_date="{ item }">
          {{ item.scheduled_date ? new Date(item.scheduled_date).toLocaleDateString() : '-' }}
        </template>

        <template #item.received_date="{ item }">
          {{ item.received_date ? new Date(item.received_date).toLocaleDateString() : '-' }}
        </template>

        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status_id)"
            size="small"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-2 justify-end align-center">
            <v-tooltip
              text="Ver detalles"
              location="top"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  v-if="can('purchases:view')"
                  v-bind="props"
                  icon
                  variant="text"
                  size="small"
                  color="info"
                  @click="viewPurchase(item.id)"
                >
                  <v-icon icon="mdi-eye" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip
              text="Editar"
              location="top"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  v-if="can('purchases:edit')"
                  v-bind="props"
                  icon
                  variant="text"
                  size="small"
                  color="primary"
                  @click="editPurchase(item.id)"
                >
                  <v-icon icon="mdi-pencil" />
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
import { usePurchasesStore } from '@/stores/purchases.store'
import type { DataTableHeader } from 'vuetify'
import PageHeader from '@/components/PageHeader.vue'
import type { Purchase } from '@/types/purchases.types'
import { useUserStore } from '@/stores/user.store'
import type { DataTableOptions } from '@/types/table.types'

definePage({
  meta: {
    permission: "purchases:view"
  }
})

const { can } = useUserStore()
const purchasesStore = usePurchasesStore()
const router = useRouter()

const headers: DataTableHeader[] = [
  { title: 'Codigo', key: 'id' },
  { title: 'Proveedor', key: 'supplier_name' },
  { title: 'Fecha Programada', key: 'scheduled_date' },
  { title: 'Fecha Recibida', key: 'received_date' },
  { title: 'Estado', key: 'status' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const viewPurchase = (id: number) => { router.push({ name: '/purchases/[id]/', params: { id } }) }
const editPurchase = (id: number) => { router.push({ name: '/purchases/[id]/edit', params: { id } }) }

const getStatusColor = (statusId: number) => {
  switch (statusId) {
    case 1: return 'warning' // Pendiente
    case 2: return 'info'    // En proceso
    case 3: return 'success' // Completado
    case 4: return 'error'   // Cancelado
    default: return 'grey'
  }
}

const itemsPerPage = ref(10)
const purchases = ref<Purchase[]>([])
const loading = ref(true)
const totalItems = ref(0)

const loadItems = async ({ page, itemsPerPage }: DataTableOptions) => {
  loading.value = true
  try {
    const response = await purchasesStore.getPurchases(page, itemsPerPage)
    purchases.value = response.purchases
    totalItems.value = response.total
  } catch (error) {
    console.error("Error loading purchases", error)
  } finally {
    loading.value = false
  }
}
</script>
