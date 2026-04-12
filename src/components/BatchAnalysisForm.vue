<template>
  <v-card :title="title">
    <v-card-text>
      <v-form ref="formRef" :readonly="readonly" @submit.prevent>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="model.analyzed_at"
              label="Fecha de análisis"
              variant="outlined"
              type="date"
              :rules="readonly ? [] : [required]"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="model.quantity_analyzed"
              label="Cantidad analizada"
              variant="outlined"
              type="number"
              :rules="readonly ? [] : [required]"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="model.quantity_available"
              label="Cantidad disponible"
              variant="outlined"
              type="number"
              :rules="readonly ? [] : [required]"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="model.quantity_used"
              label="Cantidad utilizada"
              variant="outlined"
              type="number"
              :rules="readonly ? [] : [required]"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="model.quantity_quarantined"
              label="Cantidad en cuarentena"
              variant="outlined"
              type="number"
              :rules="readonly ? [] : [required]"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="model.quantity_rejected"
              label="Cantidad rechazada"
              variant="outlined"
              type="number"
              :rules="readonly ? [] : [required]"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { BatchAnalysis } from '@/types/batchAnalysis.types'
import type { VForm } from 'vuetify/components'

const props = defineProps({
  readonly: { type: Boolean, default: false },
  title: { type: String, default: 'Datos del análisis' }
})

const model = defineModel<BatchAnalysis>({ required: true })

const required = (v: any) => (v !== null && v !== undefined && v !== '') || 'Campo requerido'

const formRef = ref<VForm>()

const validate = async () => {
  if (props.readonly) return { valid: true }
  return await formRef.value?.validate()
}

defineExpose({ validate })
</script>
