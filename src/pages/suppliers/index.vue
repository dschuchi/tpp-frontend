<template>
  <v-row>
    <v-col cols="12">
      <PageHeader title="Proveedores" subtitle="Administra los proveedores del sistema.">
        <template #actions>
          <v-btn to="/suppliers/create">
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
        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end align-center">
            <v-btn icon variant="text" size="small" color="primary" @click="editSupplier(item.id)">
              <v-icon icon="mdi-pencil" />
            </v-btn>
            <v-btn icon variant="text" size="small" color="error" @click="deleteSupplier(item.id)">
              <v-icon icon="mdi-delete" />
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue';
import { useSuppliersStore } from '@/stores/suppliers.store';
import type { DataTableHeader } from 'vuetify';

definePage({
  meta: {
    permission: '*'
  }
})

const suppliersStore = useSuppliersStore()
const search = ref('')

const headers: DataTableHeader[] = [
  { title: 'Nombre', key: 'name' },
  { title: 'DNI/CUIT', key: 'tax_id' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

onMounted(() => {
  suppliersStore.getSuppliers()
})

const editSupplier = (id: any) => {
  console.log('Edit supplier', id)
}

const deleteSupplier = (id: any) => {
  console.log('Delete supplier', id)
  suppliersStore.delete(id)
}
</script>
