<template>
  <page-header title="Permisos del Rol" subtitle="Configuración de permisos" />

  <v-data-table
    :headers="headers"
    :items="permissionsStore.permissions"
    hover
  >
    <template #[`item.assigned`]="{ item }">
      <v-checkbox
        :model-value="isAssigned(item)"
        @update:model-value="togglePermission(item)"
        color="primary"
        density="compact"
        hide-details
      ></v-checkbox>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import { usePermissionsStore } from '@/stores/permissions.store';
import { useRolesStore } from '@/stores/roles.store';
import type { DataTableHeader } from 'vuetify';

definePage({ props: true })
const props = defineProps<{ id: string }>()

// 1. Inicializamos los dos stores
const rolesStore = useRolesStore()
const permissionsStore = usePermissionsStore()

// Cargamos los datos
rolesStore.getRolePermissions(Number(props.id))
permissionsStore.getPermissions()

// 2. Agregamos la columna 'description'
const headers: DataTableHeader[] = [
  { title: 'Nombre', key: 'name', align: 'start', width: '200px' },
  { title: 'Descripción', key: 'description', align: 'start' }, // Nueva columna
  { title: 'Habilitado', key: 'assigned', align: 'center', sortable: false, width: '100px' },
]

// 3. Lógica para saber si el checkbox debe estar marcado
// Verifica si el permiso actual (del catálogo) existe en la lista del rol
const isAssigned = (permission: any) => {
  // Asumimos que rolesStore.permissions es un array de objetos con ID.
  // Si rolesStore.permissions es solo un array de IDs [1, 2, 3], usa .includes(permission.id)
  return rolesStore.permissions.some((p: any) => p.id === permission.id)
}

// 4. Lógica para prender/apagar
const togglePermission = async (permission: any) => {
  const isCurrentlyAssigned = isAssigned(permission);

  if (isCurrentlyAssigned) {
    // Si ya lo tiene, lo borramos
    await rolesStore.removePermission(Number(props.id), permission.id);
  } else {
    // Si no lo tiene, lo agregamos
    await rolesStore.addPermission(Number(props.id), permission.id);
  }

  // Opcional: Recargar permisos del rol para asegurar consistencia visual
  // await rolesStore.getRolePermissions(Number(props.id))
}
</script>
