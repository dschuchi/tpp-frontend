<template>
  <v-row>
    <v-col cols="12" class="d-flex justify-space-between align-center">
      <div>
        <h1>
          Nuevo Rol
        </h1>
        <p class="text-subtitle-1 font-weight-light text-medium-emphasis">
          Define los detalles del nuevo rol, establece su nivel de acceso y asigna los permisos correspondientes por
          módulo.
        </p>
      </div>

      <div>
        <v-btn disabled>
          Cancelar
        </v-btn>
        <v-btn disabled>
          Guardar
        </v-btn>
      </div>
    </v-col>
  </v-row>


  <v-row>
    <v-col cols="12">
      <v-card title="Datos del rol">
        <v-card-text>
          <v-row>
            <v-col cols="10">
              <v-text-field v-model="form.name" label="Nombre del rol" variant="outlined" />
            </v-col>

            <v-col cols="2">
              <v-checkbox v-model="form.active" label="Rol activo" />
            </v-col>

            <v-col cols="12">
              <v-textarea v-model="form.description" label="Descripción" variant="outlined" rows="2" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>


  <v-row>
    <v-col cols="12">
      <v-card title="Permisos del rol">
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Selecciona los permisos que estarán habilitados para este rol en cada módulo.
          </p>

          <v-data-table :headers="headers" :items="permissions">
            <template #item.active="{ item }">
              <v-checkbox v-model="item.active" hide-details />
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  active: true,
  description: ''
})

const headers = [
  { title: 'Módulo', key: 'module' },
  { title: 'Permiso', key: 'permission' },
  { title: 'Descripción', key: 'description' },
  { title: 'Activo', key: 'active' }
]

const permissions = ref([
  {
    id: 1,
    module: 'Usuarios',
    permission: 'Crear',
    description: 'Permite crear usuarios',
    active: true
  },
  {
    id: 2,
    module: 'Usuarios',
    permission: 'Eliminar',
    description: 'Permite eliminar usuarios',
    active: false
  },
  {
    id: 3,
    module: 'Productos',
    permission: 'Editar',
    description: 'Permite editar productos',
    active: true
  }
])
</script>
