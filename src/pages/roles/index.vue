<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Roles" subtitle="Administra los roles y define los permisos de acceso para los usuarios.">
        <template #actions>
          <v-btn v-if="can('roles:create')" to="/roles/new">
            Nuevo Rol
          </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-data-table-server
        :headers="headers"
        v-model:items-per-page="itemsPerPage"
        :items="roles"
        :items-length="totalItems"
        :loading="loading"
        hover
        @update:options="loadItems"
      >
        <template #item.is_active="{ value }">
          <StatusChip :value="value" />
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-2 justify-end align-center">
            <v-tooltip :text="item.is_active ? 'Desactivar' : 'Restaurar'" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('roles:edit')" v-bind="props" icon variant="text" size="small"
                  :color="item.is_active ? 'error' : 'success'" @click="toggleStatus(item)">
                  <v-icon :icon="item.is_active ? 'mdi-delete' : 'mdi-delete-restore'" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Copiar rol" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon size="small" variant="text" color="secondary"
                  @click="handleCopy(item.id)">
                  <v-icon icon="mdi-content-copy" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Configurar permisos" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon size="small" variant="text" color="secondary"
                  :to="`/roles/${item.id}/permissions`">
                  <v-icon icon="mdi-key" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Editar" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('roles:edit')" v-bind="props" icon variant="text" size="small" color="primary"
                  @click="editRole(item.id)">
                  <v-icon icon="mdi-pencil" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Ver detalles" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('roles:view')" v-bind="props" icon variant="text" size="small" color="info"
                  @click="viewRole(item.id)">
                  <v-icon icon="mdi-eye" />
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table-server>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { useRolesStore } from '@/stores/roles.store'
import type { DataTableHeader } from 'vuetify'
import { useConfirm } from '@/composables/useConfirm'
import PageHeader from '@/components/PageHeader.vue'
import type { Role } from '@/types/roles.types'
import { useUserStore } from '@/stores/user.store'
import type { DataTableOptions } from '@/types/table.types'

definePage({
  meta: {
    permission: "roles:view"
  }
})

const { can } = useUserStore()
const rolesStore = useRolesStore()
const router = useRouter()
const { confirm } = useConfirm()

const headers: DataTableHeader[] = [
  { title: 'Rol', key: 'name' },
  { title: 'Descripción', key: 'description' },
  { title: 'Estado', key: 'is_active' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const viewRole = (id: number) => { router.push({ name: '/roles/[id]/', params: { id } }) }
const editRole = (id: number) => { router.push({ name: '/roles/[id]/edit', params: { id } }) }

const toggleStatus = async (item: Role) => {
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
    item.is_active = !item.is_active
  }
}

const handleCopy = (id: number) => {
  router.push({ name: '/roles/[id]/duplicate', params: { id } })
}

const itemsPerPage = ref(10)
const roles = ref<Role[]>([])
const loading = ref(true)
const totalItems = ref(0)

const loadItems = async ({ page, itemsPerPage }: DataTableOptions) => {
  loading.value = true
  const response = await rolesStore.getRoles(page, itemsPerPage)

  roles.value = response.roles
  totalItems.value = response.total
  loading.value = false
}
</script>
