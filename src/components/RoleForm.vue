<template>
  <v-card :title="title">
    <v-card-text>
      <v-form ref="formRef" :readonly="readonly" @submit.prevent>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="model.name" label="Nombre del rol" variant="outlined"
              :rules="readonly ? [] : [required]" />
          </v-col>

          <v-col cols="12">
            <v-textarea v-model="model.description" label="Descripción" variant="outlined" rows="2"
              :rules="readonly ? [] : [required]" />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { CreateRoleRequest } from '@/types/roles.types'
import type { VForm } from 'vuetify/components'

const props = defineProps({
  readonly: { type: Boolean, default: false },
  title: { type: String, default: 'Datos del rol' }
})

const model = defineModel<CreateRoleRequest>({ required: true })

const required = (v: string) => !!v || 'Campo requerido'

// Exponemos la validación al padre
const formRef = ref<VForm>()

const validate = async () => {
  if (props.readonly) return { valid: true } // Siempre válido si es solo lectura
  return await formRef.value?.validate()
}

// Permitimos que el padre llame a roleFormRef.value.validate()
defineExpose({ validate })
</script>
