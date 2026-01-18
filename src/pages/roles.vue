<template>
  <v-row>
    <v-col cols="12" class="d-flex justify-space-between align-center">
      <div>
        <h1>
          Roles
        </h1>
        <p class="text-subtitle-1 font-weight-light text-medium-emphasis">
          Administra los roles y define los permisos de acceso para los usuarios.
        </p>
      </div>

      <v-btn disabled>
        Nuevo Rol
      </v-btn>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-data-table :headers="headers" :items="roles">
        <template v-slot:item.is_active="{ value }">
          <v-chip :color="value ? 'success' : 'error'" size="small">
            {{ value ? 'Activo' : 'Inactivo' }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-2 justify-end">
            <v-btn v-if="item.is_active" @click="openConfirm('deactivate', item.id)">
              <v-icon icon="mdi-delete" />
            </v-btn>

            <v-btn v-else @click="openConfirm('activate', item.id)">
              <v-icon icon="mdi-delete-restore" />
            </v-btn>


            <v-btn disabled @click="editRole(item.id)">
              <v-icon icon=" mdi-pencil"></v-icon>
            </v-btn>

            <v-btn disabled @click="getRole(item.id)">
              <v-icon icon=" mdi-eye"></v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <ConfirmDialog v-model="confirmDialog" :title="dialogTitle" :message="dialogMessage"
    :confirm-text="confirmButtonText" :confirm-color="confirmColor" @confirm="confirmAction" />
</template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useRolesStore } from '@/stores/roles.store'
import type { DataTableHeader } from 'vuetify'

const rolesStore = useRolesStore()

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

const getRole = (id: number) => { }
const editRole = (id: number) => { }

type RoleAction = 'activate' | 'deactivate'

const confirmDialog = ref(false)
const selectedRoleId = ref<number | null>(null)
const pendingAction = ref<RoleAction | null>(null)

const dialogTitle = computed(() => {
  return pendingAction.value === 'deactivate'
    ? 'Desactivar rol'
    : 'Activar rol'
})

const dialogMessage = computed(() => {
  return pendingAction.value === 'deactivate'
    ? '¿Estás seguro de que querés desactivar este rol?'
    : '¿Estás seguro de que querés activar este rol?'
})

const confirmColor = computed(() => {
  return pendingAction.value === 'deactivate'
    ? 'error'
    : 'success'
})

const confirmButtonText = computed(() =>
  pendingAction.value === 'deactivate'
    ? 'Desactivar'
    : 'Activar'
)

const openConfirm = (action: RoleAction, id: number) => {
  pendingAction.value = action
  selectedRoleId.value = id
  confirmDialog.value = true
}

const closeConfirm = () => {
  confirmDialog.value = false
  pendingAction.value = null
  selectedRoleId.value = null
}

const confirmAction = () => {
  if (!selectedRoleId.value || !pendingAction.value) return

  if (pendingAction.value === 'deactivate') {
    rolesStore.deactivateRole(selectedRoleId.value)
  } else {
    rolesStore.activateRole(selectedRoleId.value)
  }

  closeConfirm()
}
</script>
