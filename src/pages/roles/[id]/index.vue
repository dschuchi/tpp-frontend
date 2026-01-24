<template>
  <v-row>
    <v-col cols="12" class="d-flex justify-space-between align-center">
      <div>
        <h1>
          Detalle del Rol
        </h1>
        <p class="text-subtitle-1 font-weight-light text-medium-emphasis">
          Visualización de permisos y datos.
        </p>
      </div>
    </v-col>
  </v-row>


  <v-row>
    <v-col cols="12">
      <v-card title="Datos del rol">
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="form.name" label="Nombre del rol" variant="outlined" readonly/>
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="form.description" label="Descripción" variant="outlined" rows="2" readonly/>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { CreateRoleRequest } from '@/types/roles.types'
import { reactive, type Reactive } from 'vue'

definePage({
  props: true
})

defineProps<{
  id: string
}>()

const form: Reactive<CreateRoleRequest> = reactive({
  name: '',
  description: ''
})

onMounted(() => {
  form.name = 'TBD'
  form.description = 'TBD'
})
</script>
