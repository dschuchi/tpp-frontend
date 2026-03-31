<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Lotes" subtitle="Administra los lotes del sistema.">
        <template #actions>
          <v-btn v-if="can('batchs:create')" to="/batchs/new">
            Nuevo Lote
          </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-data-table-server
        :headers="headers"
        :items="batchs"
        :items-length="totalItems"
        :items-per-page="itemsPerPage"
        :loading="loading"
        hover
        @update:options="loadItems"
      >
        <template #item.tipo="{ item }">
          <div v-if="item.raw_material_name" class="d-flex align-center ga-1">
            <v-icon size="small" color="secondary">mdi-package-variant</v-icon>
            <span>{{ item.raw_material_name }}</span>
          </div>
          <div v-else-if="item.packaging_material_name" class="d-flex align-center ga-1">
            <v-icon size="small" color="secondary">mdi-package-variant-closed</v-icon>
            <span>{{ item.packaging_material_name }}</span>
          </div>
          <span v-else class="text-medium-emphasis">—</span>
        </template>

        <template #item.supplier_id="{ item }">
          <span v-if="item.supplier_name">{{ item.supplier_name }}</span>
          <span v-else class="text-medium-emphasis">—</span>
        </template>

        <template #item.customer_id="{ item }">
          <span v-if="item.customer_name">{{ item.customer_name }}</span>
          <span v-else class="text-medium-emphasis">—</span>
        </template>

        <template #item.expiration_date="{ value }">
          <span v-if="value" :class="isExpiringSoon(value) ? 'text-warning font-weight-medium' : ''">
            {{ formatDate(value) }}
            <v-icon v-if="isExpired(value)" size="x-small" color="error" class="ml-1">mdi-alert-circle</v-icon>
          </span>
          <span v-else class="text-medium-emphasis">—</span>
        </template>

        <template #item.is_active="{ value }">
          <status-chip :value="value" />
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end align-center">
            <v-tooltip text="Ver análisis" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('batchs-analysis:view')" v-bind="props" icon variant="text" size="small" color="secondary"
                  @click="goToAnalysis(item.id)">
                  <v-icon icon="mdi-flask" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip :text="item.is_active ? 'Desactivar' : 'Restaurar'" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('batchs:edit')" v-bind="props" icon variant="text" size="small"
                  :color="item.is_active ? 'error' : 'success'" @click="toggleStatus(item)">
                  <v-icon :icon="item.is_active ? 'mdi-delete' : 'mdi-delete-restore'" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Editar" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('batchs:edit')" v-bind="props" icon variant="text" size="small" color="primary"
                  @click="editBatch(item.id)">
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
import PageHeader from '@/components/PageHeader.vue';
import { useConfirm } from '@/composables/useConfirm';
import { useBatchsStore } from '@/stores/batchs.store';
import { useRawMaterialsStore } from '@/stores/rawMaterials.store';
import { usePackagingMaterialsStore } from '@/stores/packagingMaterials.store';
import { useSuppliersStore } from '@/stores/suppliers.store';
import { useCustomersStore } from '@/stores/customers.store';
import { useUserStore } from '@/stores/user.store';
import type { Batch } from '@/types/batchs.types';
import type { DataTableOptions } from '@/types/table.types';
import type { DataTableHeader } from 'vuetify';

definePage({
  meta: {
    permission: 'batchs:view'
  }
})

const { can } = useUserStore()
const batchsStore = useBatchsStore()
const rawMaterialsStore = useRawMaterialsStore()
const packagingMaterialsStore = usePackagingMaterialsStore()
const suppliersStore = useSuppliersStore()
const customersStore = useCustomersStore()

const headers: DataTableHeader[] = [
  { title: 'N° Lote', key: 'batch_number' },
  { title: 'Cantidad', key: 'quantity' },
  { title: 'Materia Prima / Mat. Empaque', key: 'tipo', sortable: false },
  { title: 'Proveedor', key: 'supplier_id', sortable: false },
  { title: 'Cliente', key: 'customer_id', sortable: false },
  { title: 'Vencimiento', key: 'expiration_date', sortable: false },
  { title: 'Estado', key: 'is_active' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const router = useRouter()
const editBatch = (id: any) => router.push({ name: '/batchs/[id]/edit', params: { id } })
const goToAnalysis = (id: any) => router.push({ name: '/batchs/[id]/analysis/', params: { id } })

const { confirm } = useConfirm()

const toggleStatus = async (item: any) => {
  const { id } = item
  const isDeactivating = item.is_active

  const ok = await confirm({
    title: isDeactivating ? 'Desactivar lote' : 'Activar lote',
    message: `¿Estás seguro de que querés ${isDeactivating ? 'desactivar' : 'activar'} este lote?`,
    confirmText: isDeactivating ? 'Desactivar' : 'Activar',
    confirmColor: isDeactivating ? 'error' : 'success'
  })

  if (ok) {
    isDeactivating ? await batchsStore.deactivate(id) : await batchsStore.activate(id)
    item.is_active = !item.is_active
  }
}

const formatDate = (value: string | Date) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('es-AR')
}

const isExpired = (value: string | Date) => new Date(value) < new Date()
const isExpiringSoon = (value: string | Date) => {
  const d = new Date(value)
  const in30 = new Date()
  in30.setDate(in30.getDate() + 30)
  return d < in30
}

const itemsPerPage = ref(10)
const batchs = ref<Batch[]>([])
const loading = ref(true)
const totalItems = ref(0)

const loadItems = async ({ page, itemsPerPage }: DataTableOptions) => {
  loading.value = true
  try {
    const response = await batchsStore.getBatchs(page, itemsPerPage)

    batchs.value = await Promise.all(response.batches.map(async (batch) => {
      const [rawMaterial, packagingMaterial, supplier, customer] = await Promise.all([
        batch.raw_material_id ? rawMaterialsStore.getRawMaterial(batch.raw_material_id) : Promise.resolve(null),
        batch.packaging_material_id ? packagingMaterialsStore.getPackagingMaterial(batch.packaging_material_id) : Promise.resolve(null),
        batch.supplier_id ? suppliersStore.getSupplier(batch.supplier_id) : Promise.resolve(null),
        batch.customer_id ? customersStore.getCustomer(batch.customer_id) : Promise.resolve(null),
      ])

      return {
        ...batch,
        raw_material_name: rawMaterial?.name ?? null,
        packaging_material_name: packagingMaterial?.code ?? null,
        supplier_name: supplier?.name ?? null,
        customer_name: customer?.name ?? null,
      }
    }))

    totalItems.value = response.total
  } catch (error) {
    console.error('Error cargando lotes:', error)
  } finally {
    loading.value = false
  }
}
</script>
