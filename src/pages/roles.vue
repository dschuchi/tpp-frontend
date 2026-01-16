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
        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-2 justify-end">
            <v-btn disabled @click=" deleteRole(item.id)">
              <v-icon icon="mdi-delete"></v-icon>
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
  { title: 'ID', key: 'id' },
  { title: 'Rol', key: 'name' },
  { title: 'Descripción', key: 'description' },
  { title: 'Estado', key: 'is_active' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const getRole = (id: number) => { }
const editRole = (id: number) => { }
const deleteRole = (id: number) => { }
</script>
