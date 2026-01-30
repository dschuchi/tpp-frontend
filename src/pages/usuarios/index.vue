<template>
  <v-row>
    <v-col cols="12">
      <PageHeader title="Usuarios" subtitle="Administra los usuarios del sistema.">
        <template #actions>
          <v-btn v-if="can('users:create')" to="/usuarios/nuevo">
            Nuevo Usuario
          </v-btn>
        </template>
      </PageHeader>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-data-table :headers="headers" :items="usersStore.users">
        <template #item.is_active="{ value }">
          <StatusChip :value="value" />
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end align-center">
            <v-tooltip :text="item.is_active ? 'Desactivar' : 'Restaurar'" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('users:delete')" v-bind="props" icon variant="text" size="small"
                  :color="item.is_active ? 'error' : 'success'" @click="toggleStatus(item)">
                  <v-icon :icon="item.is_active ? 'mdi-delete' : 'mdi-delete-restore'" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Editar" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('users:edit:all')" v-bind="props" icon variant="text" size="small" color="primary"
                  @click="editRole(item.id)">
                  <v-icon icon="mdi-pencil" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Ver detalles" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('users:edit:all')" v-bind="props" icon variant="text" size="small" color="info"
                  @click="viewRole(item.id)">
                  <v-icon icon="mdi-eye" />
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
import { useUserStore } from '@/stores/user.store';
import { useUsersStore } from '@/stores/users.store';
import type { DataTableHeader } from 'vuetify';

definePage({
  meta: {
    permission: 'users:edit:all'
  }
})

const usersStore = useUsersStore()
const { can } = useUserStore()

onMounted(() => {
  usersStore.getUsers()
})

const headers: DataTableHeader[] = [
  { title: 'Nombre', key: 'username' },
  { title: 'Apellido', key: 'lastname' },
  { title: 'Correo', key: 'email' },
  { title: 'Rol', key: 'role_name' },
  { title: 'Estado', key: 'is_active' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const viewRole = (id: any) => alert(id)
const editRole = (id: any) => alert(id)
const toggleStatus = (id: any) => alert(id)

</script>
