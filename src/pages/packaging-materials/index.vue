<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Materiales de Empaque" subtitle="Administra los materiales de empaque del sistema.">
        <template #actions>
          <v-btn v-if="can('packaging-materials:create')" to="/packaging-materials/new">
            Nuevo Material de Empaque
          </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-data-table-server
        :headers="headers"
        :items="packagingMaterials"
        :items-length="totalItems"
        :items-per-page="itemsPerPage"
        :loading="loading"
        hover
        @update:options="loadItems"
      >
        <template #item.customer_id="{ item }">
          {{ item.customer_name }}
        </template>
        <template #item.supplier_id="{ item }">
          {{ item.supplier_name }}
        </template>
        <template #item.is_active="{ value }">
          <status-chip :value="value" />
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end align-center">
            <v-tooltip :text="item.is_active ? 'Desactivar' : 'Restaurar'" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('packaging-materials:edit')" v-bind="props" icon variant="text" size="small"
                  :color="item.is_active ? 'error' : 'success'" @click="toggleStatus(item)">
                  <v-icon :icon="item.is_active ? 'mdi-delete' : 'mdi-delete-restore'" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Editar" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('packaging-materials:edit')" v-bind="props" icon variant="text" size="small" color="primary"
                  @click="editPackagingMaterial(item.id)">
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
import PageHeader from '@/components/PageHeader.vue'
import { useConfirm } from '@/composables/useConfirm'
import { usePackagingMaterialsStore } from '@/stores/packagingMaterials.store'
import { useCustomersStore } from '@/stores/customers.store'
import { useSuppliersStore } from '@/stores/suppliers.store'
import { useUserStore } from '@/stores/user.store'
import type { DataTableHeader } from 'vuetify'
import type { PackagingMaterial } from '@/types/packagingMaterials.types'
import type { DataTableOptions } from '@/types/table.types'

definePage({
  meta: {
    permission: 'packaging-materials:view'
  }
})

const { can } = useUserStore()
const packagingMaterialsStore = usePackagingMaterialsStore()
const customersStore = useCustomersStore()
const suppliersStore = useSuppliersStore()

const headers: DataTableHeader[] = [
  { title: 'Código', key: 'code' },
  { title: 'Descripción', key: 'description' },
  { title: 'Cliente', key: 'customer_id' },
  { title: 'Proveedor', key: 'supplier_id' },
  { title: 'Estado', key: 'is_active' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const router = useRouter()
const editPackagingMaterial = (id: any) => router.push({ name: '/packaging-materials/[id]/edit', params: { id } })

const { confirm } = useConfirm()

const toggleStatus = async (item: any) => {
  const { id } = item
  const isDeactivating = item.is_active

  const ok = await confirm({
    title: isDeactivating ? 'Desactivar material de empaque' : 'Activar material de empaque',
    message: `¿Estás seguro de que querés ${isDeactivating ? 'desactivar' : 'activar'} este material de empaque?`,
    confirmText: isDeactivating ? 'Desactivar' : 'Activar',
    confirmColor: isDeactivating ? 'error' : 'success'
  })

  if (ok) {
    isDeactivating ? await packagingMaterialsStore.deactivate(id) : await packagingMaterialsStore.activate(id)
    item.is_active = !item.is_active
  }
}

const itemsPerPage = ref(10)
const packagingMaterials = ref<PackagingMaterial[]>([])
const loading = ref(true)
const totalItems = ref(0)

const loadItems = async ({ page, itemsPerPage }: DataTableOptions) => {
  loading.value = true
  const response = await packagingMaterialsStore.getPackagingMaterials(page, itemsPerPage)

  packagingMaterials.value = await Promise.all(response.packagingMaterials.map(async (packagingMaterial) => {
    const customer = packagingMaterial.customer_id
      ? await customersStore.getCustomer(packagingMaterial.customer_id)
      : null

    const supplier = packagingMaterial.supplier_id
      ? await suppliersStore.getSupplier(packagingMaterial.supplier_id)
      : null
    return {
      ...packagingMaterial,
      customer_name: customer?.name ?? '-',
      supplier_name: supplier?.name ?? '-'
    }
  }))

  totalItems.value = response.total
  loading.value = false
}
</script>
