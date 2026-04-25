<template>
  <v-card :title="title">
    <v-card-text>
      <v-form
        ref="formRef"
        :readonly="readonly"
        @submit.prevent
      >
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="model.name"
              label="Nombre"
              variant="outlined"
              :rules="readonly ? [] : [required]"
            />
          </v-col>
          <v-col cols="12">
            <v-number-input
              v-model="model.density"
              label="Densidad"
              variant="outlined"
              :precision="null"
              control-variant="hidden"
              :rules="readonly ? [] : []"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { RawMaterial } from '@/types/rawMaterials.types'
import type { VForm } from 'vuetify/components'

const props = defineProps({
  readonly: { type: Boolean, default: false },
  title: { type: String, default: 'Datos de la materia prima' }
})

const model = defineModel<RawMaterial>({ required: true })

const required = (v: string) => !!v || 'Campo requerido'

const formRef = ref<VForm>()

const validate = async () => {
  if (props.readonly) return { valid: true }
  return await formRef.value?.validate()
}

defineExpose({ validate })
</script>
