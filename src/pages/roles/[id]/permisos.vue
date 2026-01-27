<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Permisos del Rol" subtitle="Configuración de permisos" back-route="/roles"
        back-text="Roles" />
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-data-table :headers="headers" :items="permissionsStore.permissions" hover>
        <template #[`item.assigned`]="{ item }">
          <v-checkbox :model-value="isAssigned(item)" @update:model-value="togglePermission(item)" color="primary"
            density="compact" hide-details></v-checkbox>
        </template>
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

definePage({ props: true })
const props = defineProps<{ id: string }>()

const rolesStore = useRolesStore()
const permissionsStore = usePermissionsStore()

rolesStore.getRole(Number(props.id))
permissionsStore.getPermissions()

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
</script>
