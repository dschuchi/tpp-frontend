<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Permisos del Rol" subtitle="Configuración de permisos" :back-route="{name:'/roles/'}"
        back-text="Roles" />
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-form @submit.prevent="handleSearch">
        <v-text-field v-model="searchInput" label="Nombre" clearable @click:clear="activeSearch=''">
          <template #append>
            <v-btn prepend-icon="mdi-magnify" size="large" @click="handleSearch"> Buscar </v-btn>
          </template>
        </v-text-field>
      </v-form>

      <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
        :items-length="totalItems" :loading="loading" :search="activeSearch" item-value="name" hover
        @update:options="loadItems">
        <template #[`item.assigned`]="{ item }">
          <v-checkbox :model-value="isAssigned(item)" @update:model-value="togglePermission(item)" color="primary"
            density="compact" hide-details></v-checkbox>
        </template>
      </v-data-table-server>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import { usePermissionsStore } from '@/stores/permissions.store';
import { useRolesStore } from '@/stores/roles.store';
import type { Permission } from '@/types/permissions.types';
import type { DataTableOptions } from '@/types/table.types';
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

const activeSearch = ref('')
const searchInput = ref('')

const handleSearch = () => {
  activeSearch.value = searchInput.value
}

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

const loadItems = async ({ page, itemsPerPage, search }: DataTableOptions) => {
  loading.value = true
  const response = await permissionsStore.getPermissions(page, itemsPerPage, search)

  serverItems.value = response.permissions
  totalItems.value = response.total
  loading.value = false
}

</script>
