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

  <v-dialog v-model="copyModal" max-width="500px">
    <v-card>
      <v-card-title class="pa-4 pb-0 text-h5">Copiar Rol</v-card-title>
      <v-card-text class="pa-4 pt-2">
        <RoleForm ref="copyFormRef" v-model="copyData" title="" />
      </v-card-text>
      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="closeCopyModal">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" :loading="copying" @click="submitCopy">Copiar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useRolesStore } from '@/stores/roles.store'
import type { DataTableHeader } from 'vuetify'
import { useConfirm } from '@/composables/useConfirm'
import PageHeader from '@/components/PageHeader.vue'
import RoleForm from '@/components/RoleForm.vue'
import type { Role, CreateRoleRequest } from '@/types/roles.types'
import { useUserStore } from '@/stores/user.store'
import type { DataTableOptions } from '@/types/table.types'
import { useSnackbarStore } from '@/stores/snackbar.store'

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

const snackbarStore = useSnackbarStore()

const copyModal = ref(false)
const copying = ref(false)
const copyFormRef = ref()
const copyingRoleId = ref<number | null>(null)
const copyData = ref<CreateRoleRequest>({ name: '', description: '' })

const handleCopy = async (id: number) => {
  try {
    const role = await rolesStore.getRole(id)
    copyData.value = {
      name: `${role.name} (copia)`,
      description: role.description
    }
    copyingRoleId.value = id
    copyModal.value = true
  } catch (error) {
    snackbarStore.showMessage({ message: 'Ocurrió un error al obtener los datos del rol', color: 'error' })
  }
}

const submitCopy = async () => {
  const { valid } = await copyFormRef.value.validate()
  if (!valid) return

  if (!copyingRoleId.value) return

  copying.value = true
  try {
    await rolesStore.duplicateRole(copyingRoleId.value, copyData.value)
    snackbarStore.showMessage({ message: 'Rol copiado exitosamente', color: 'success' })
    copyModal.value = false
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value })
  } catch (error) {
    snackbarStore.showMessage({ message: 'Ocurrió un error al copiar el rol', color: 'error' })
  } finally {
    copying.value = false
  }
}

const closeCopyModal = () => {
  copyModal.value = false
  copyingRoleId.value = null
  copyData.value = { name: '', description: '' }
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
