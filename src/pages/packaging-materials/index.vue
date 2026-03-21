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
      <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" />

      <v-data-table :headers="headers" :items="packagingMaterialsStore.packagingMaterials" :search="search">
        <template #item.customer_id="{ item }">
          {{ customerName(item.customer_id) }}
        </template>
        <template #item.supplier_id="{ item }">
          {{ supplierName(item.supplier_id) }}
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
      </v-data-table>
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

definePage({
  meta: {
    permission: 'packaging-materials:view'
  }
})

const { can } = useUserStore()
const packagingMaterialsStore = usePackagingMaterialsStore()
const customersStore = useCustomersStore()
const suppliersStore = useSuppliersStore()
const search = ref('')

const headers: DataTableHeader[] = [
  { title: 'Código', key: 'code' },
  { title: 'Descripción', key: 'description' },
  { title: 'Cliente', key: 'customer_id' },
  { title: 'Proveedor', key: 'supplier_id' },
  { title: 'Estado', key: 'is_active' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

onMounted(() => {
  packagingMaterialsStore.getPackagingMaterials()
  if (!customersStore.customers.length) {
    customersStore.getCustomers(1,100)
  }
  if (!suppliersStore.suppliers.length) {
    suppliersStore.getSuppliers(1,100)
  }
})

const customerName = (id: number | null) => {
  if (!id) return '-'
  return customersStore.customers.find(c => c.id === id)?.name ?? '-'
}

const supplierName = (id: number | null) => {
  if (!id) return '-'
  return suppliersStore.suppliers.find(s => s.id === id)?.name ?? '-'
}

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
  }
}
</script>
