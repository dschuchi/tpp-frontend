<template>
  <v-row>
    <v-col cols="12">
      <PageHeader title="Clientes" subtitle="Administra los clientes del sistema.">
        <template #actions>
          <v-btn v-if="can('customers:create')" to="/customers/new">
            Nuevo Cliente
          </v-btn>
        </template>
      </PageHeader>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-data-table :headers="headers" :items="customers">
        <template #item.is_active="{ value }">
          <status-chip :value="value" />
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-2 justify-end align-center">
            <v-tooltip :text="item.is_active ? 'Desactivar' : 'Restaurar'" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('customers:edit')" v-bind="props" icon variant="text" size="small"
                       :color="item.is_active ? 'error' : 'success'" @click="toggleStatus(item)">
                  <v-icon :icon="item.is_active ? 'mdi-delete' : 'mdi-delete-restore'" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Editar" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('customers:edit')" v-bind="props" icon variant="text" size="small" color="primary"
                       @click="editCustomer(item.id)">
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
import PageHeader from '@/components/PageHeader.vue';
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.store';
import type { DataTableHeader } from 'vuetify';
import { useCustomersStore } from "@/stores/customers.store.ts";
import type { Customer } from "@/types/customers.types.ts";
import { useConfirm } from "@/composables/useConfirm.ts";

definePage({
  meta: {
    permission: 'customers:view'
  }
})

const { can } = useUserStore()
const customersStore = useCustomersStore()
const router = useRouter()
const { confirm } = useConfirm()

onMounted(() => {
  customersStore.getCustomers()
})

const customers = computed(() => customersStore.customers)

const headers: DataTableHeader[] = [
  { title: 'Nombre', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'CUIT', key: 'tax_id' },
  { title: 'Dirección', key: 'address' },
  { title: 'Teléfono', key: 'phone' },
  { title: 'Estado', key: 'is_active' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const editCustomer = (id: number) => { router.push({ name: '/customers/[id]/edit', params: { id } }) }

const toggleStatus = async (item: Customer) => {
  const { id } = item
  const isDeactivating = item.is_active

  const ok = await confirm({
    title: isDeactivating ? 'Desactivar cliente' : 'Activar cliente',
    message: `¿Estás seguro de que querés ${isDeactivating ? 'desactivar' : 'activar'} este cliente?`,
    confirmText: isDeactivating ? 'Desactivar' : 'Activar',
    confirmColor: isDeactivating ? 'error' : 'success'
  })

  if (ok) {
    isDeactivating ? await customersStore.deactivateCustomer(id) : await customersStore.activateCustomer(id)
  }
}
</script>
