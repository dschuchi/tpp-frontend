<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Permisos del Rol" subtitle="Configuración de permisos" back-route="/roles"
        back-text="Roles" />
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify"></v-text-field>

      <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
        :items-length="totalItems" :loading="loading" :search="search" item-value="name" hover
        @update:options="loadItems">
        <template #[`item.assigned`]="{ item }">
          <v-checkbox :model-value="isAssigned(item)" @update:model-value="togglePermission(item)" color="primary"
            density="compact" hide-details></v-checkbox>
        </template>
      </v-data-table-server>

      <v-data-table v-if="false" :headers="headers" :items="permissionsStore.permissions" :search="search">

      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import { usePermissionsStore } from '@/stores/permissions.store';
import { useRolesStore } from '@/stores/roles.store';
import type { Permission } from '@/types/permissions.types';
import type { DataTableHeader } from 'vuetify';

definePage({
  props: true,
  meta: {
    permission: 'roles:edit'
  }
})
const props = defineProps<{ id: string }>()

const rolesStore = useRolesStore()
const permissionsStore = usePermissionsStore()

const search = ref('')

onMounted(async () => {
  await rolesStore.getRole(Number(props.id))
  const response = await permissionsStore.getPermissions(1, itemsPerPage.value)

  const lastPage = await permissionsStore.getPermissions(response.total_pages, itemsPerPage.value)

  totalItems.value = (response.total_pages - 1) * itemsPerPage.value + lastPage.permissions.length
})

const headers: DataTableHeader[] = [
  { title: 'Nombre', key: 'name', align: 'start', width: '200px' },
  { title: 'Descripción', key: 'description', align: 'start' },
  { title: 'Habilitado', key: 'assigned', align: 'center', sortable: false, width: '100px' },
]

const isAssigned = (permission: Permission) => {
  return rolesStore.permissions.some((p: any) => p.id === permission.id)
}

const togglePermission = async (permission: Permission) => {
  const isCurrentlyAssigned = isAssigned(permission);

  if (isCurrentlyAssigned) {
    await rolesStore.removePermission(Number(props.id), permission.id);
  } else {
    await rolesStore.addPermission(Number(props.id), permission.id);
  }
}

const itemsPerPage = ref(10)
const serverItems = ref<Permission[]>([])
const loading = ref(true)
const totalItems = ref(0)

export interface DataTableOptions {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: 'asc' | 'desc' }[];
  groupBy?: { key: string; order: 'asc' | 'desc' }[];
  search?: string;
}

const loadItems = async ({ page, itemsPerPage }: DataTableOptions) => {
  loading.value = true
  const response = await permissionsStore.getPermissions(page, itemsPerPage)

  serverItems.value = response.permissions
  loading.value = false
}

</script>
