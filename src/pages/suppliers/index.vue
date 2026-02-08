<template>
  <v-row>
    <v-col cols="12">
      <PageHeader title="Proveedores" subtitle="Administra los proveedores del sistema.">
        <template #actions>
          <v-btn v-if="can('suppliers:create')" to="/suppliers/new">
            Nuevo Proveedor
          </v-btn>
        </template>
      </PageHeader>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify"></v-text-field>

      <v-data-table :headers="headers" :items="suppliersStore.suppliers" :search="search">
        <template #item.is_active="{ value }">
          <StatusChip :value="value" />
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end align-center">
            <v-btn icon variant="text" size="small" color="primary" @click="editSupplier(item.id)">
              <v-icon icon="mdi-pencil" />
            </v-btn>
            <v-tooltip v-if="can('suppliers:delete')" :text="item.is_active ? 'Desactivar' : 'Restaurar'"
              location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon variant="text" size="small" :color="item.is_active ? 'error' : 'success'"
                  @click="toggleStatus(item)">
                  <v-icon :icon="item.is_active ? 'mdi-delete' : 'mdi-delete-restore'" />
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
import PageHeader from '@/components/PageHeader.vue';
import { useConfirm } from '@/composables/useConfirm';
import { useSuppliersStore } from '@/stores/suppliers.store';
import { useUserStore } from '@/stores/user.store';
import type { DataTableHeader } from 'vuetify';

definePage({
  meta: {
    permission: '*'
  }
})

const { can } = useUserStore()
const suppliersStore = useSuppliersStore()
const search = ref('')

const headers: DataTableHeader[] = [
  { title: 'Nombre', key: 'name' },
  { title: 'DNI/CUIT', key: 'tax_id' },
  { title: 'Estado', key: 'is_active' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

onMounted(() => {
  suppliersStore.getSuppliers()
})

const editSupplier = (id: any) => {
  console.log('Edit supplier', id)
}

const { confirm } = useConfirm()

const toggleStatus = async (item: any) => {
  const { id } = item
  const isDeactivating = item.is_active

  const ok = await confirm({
    title: isDeactivating ? 'Desactivar proveedor' : 'Activar proveedor',
    message: `¿Estás seguro de que querés ${isDeactivating ? 'desactivar' : 'activar'} este proveedor?`,
    confirmText: isDeactivating ? 'Desactivar' : 'Activar',
    confirmColor: isDeactivating ? 'error' : 'success'
  })

  if (ok) {
    isDeactivating ? suppliersStore.deactivate(id) : suppliersStore.activate(id)
  }
}
</script>
