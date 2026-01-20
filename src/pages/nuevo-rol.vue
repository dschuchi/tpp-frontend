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
      <v-card class="pa-4" elevation="1">
        <v-card-title class="text-h6">
          Datos del rol
        </v-card-title>

        <v-card-text>
          <v-row>
            <!-- Nombre del rol: ocupa el espacio restante -->
            <v-col class="flex-grow-1">
              <v-text-field v-model="form.name" label="Nombre del rol" variant="outlined" density="comfortable"
                required />
            </v-col>

            <!-- Estado: tamaño automático -->
            <v-col cols="auto" class="d-flex align-center">
              <v-switch v-model="form.active" :label="form.active ? 'Activo' : 'Inactivo'" inset color="primary" />
            </v-col>

            <!-- Descripción -->
            <v-col cols="12">
              <v-textarea v-model="form.description" label="Descripción" variant="outlined" rows="3" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const form = reactive({
  name: '',
  active: true,
  description: ''
})
</script>
