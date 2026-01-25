<template>
  <page-header title="Detalle del Rol" subtitle="Visualización de permisos y datos." />

  <v-row>
    <v-col cols="12">
      <v-card title="Datos del rol">
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="form.name" label="Nombre del rol" variant="outlined" readonly />
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="form.description" label="Descripción" variant="outlined" rows="2" readonly />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
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
