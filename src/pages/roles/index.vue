<template>
  <page-header title="Roles" subtitle="Administra los roles y define los permisos de acceso para los usuarios.">
    <template #actions>
      <v-btn to="/roles/nuevo">
        Nuevo Rol
      </v-btn>
    </template>
  </page-header>

  <v-row>
    <v-col cols="12">
      <v-data-table :headers="headers" :items="roles">
        <template #item.is_active="{ value }">
          <StatusChip :value="value" />
        </template>

        <template v-slot:item.actions="{ item }">
          <TableActions :id="item.id" :is-active="item.is_active" :can-soft-delete="true" :can-hard-delete="false"
            @view="viewRole" @edit="editRole" @soft-delete="() => confirmToggleStatus(item)" />
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useRolesStore } from '@/stores/roles.store'
import type { DataTableHeader } from 'vuetify'
import { useConfirm } from '@/composables/useConfirm'
import PageHeader from '@/components/PageHeader.vue'
import TableActions from '@/components/TableActions.vue'
import type { Role } from '@/types/roles.types'

const rolesStore = useRolesStore()
const router = useRouter()
const { confirm } = useConfirm()

onMounted(() => {
  rolesStore.getRoles()
})

const roles = computed(() => rolesStore.roles)

const headers: DataTableHeader[] = [
  { title: 'Rol', key: 'name' },
  { title: 'Descripción', key: 'description' },
  { title: 'Estado', key: 'is_active' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const viewRole = (id: number) => { router.push({ name: '/roles/[id]/', params: { id } }) }
const editRole = (id: number) => { router.push({ name: '/roles/[id]/editar', params: { id } }) }

const confirmToggleStatus = async (item: Role) => {
  const { id } = item
  const isDeactivating = item.is_active

  const ok = await confirm({
    title: isDeactivating ? 'Desactivar rol' : 'Activar rol',
    message: `¿Estás seguro de que querés ${isDeactivating ? 'desactivar' : 'activar'} este rol?`,
    confirmText: isDeactivating ? 'Desactivar' : 'Activar',
    confirmColor: isDeactivating ? 'error' : 'success'
  })

  if (ok) {
    isDeactivating ? rolesStore.deactivateRole(id) : rolesStore.activateRole(id)
  }
}
</script>
