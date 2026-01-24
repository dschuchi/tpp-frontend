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

      <v-btn to="nuevo-rol">
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
            <v-btn v-if="item.is_active" @click="confirmDeactivate(item.id)">
              <v-icon icon="mdi-delete" />
            </v-btn>

            <v-btn v-else @click="confirmActivate(item.id)">
              <v-icon icon="mdi-delete-restore" />
            </v-btn>

            <v-btn @click="editRole(item.id)">
              <v-icon icon="mdi-pencil"></v-icon>
            </v-btn>

            <v-btn @click="viewRole(item.id)">
              <v-icon icon="mdi-eye"></v-icon>
            </v-btn>
          </div>
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

const confirmActivate = async (id: number) => {
  const ok = await confirm({
    title: 'Activar rol',
    message: '¿Estás seguro de que querés activar este rol?',
    confirmText: 'Activar',
    confirmColor: 'success'
  })
  if (ok) {
    rolesStore.activateRole(id)
  }
}

const confirmDeactivate = async (id: number) => {
  const ok = await confirm({
    title: 'Desactivar rol',
    message: '¿Estás seguro de que querés desactivar este rol?',
    confirmText: 'Desactivar',
    confirmColor: 'error'
  })
  if (ok) {
    rolesStore.deactivateRole(id)
  }
}
</script>
