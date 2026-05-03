<template>
  <v-card :title="title">
    <v-card-text>
      <v-form ref="formRef" :readonly="readonly" @submit.prevent>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="model.employee_id" label="Legajo" variant="outlined"
              :rules="readonly ? [] : [required]" />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="model.username" label="Nombre" variant="outlined"
              :rules="readonly ? [] : [required]" />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="model.lastname" label="Apellido" variant="outlined"
              :rules="readonly ? [] : [required]" />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="model.email" label="Correo electrónico" variant="outlined"
              :rules="readonly ? [] : [required, emailRule]" />
          </v-col>

          <v-col v-if="showRole" cols="12">
            <roles-select v-model="model.rol_id" density="compact" variant="outlined" :rules="readonly ? [] : [required]" />
          </v-col>

          <v-col v-if="showPassword" cols="12">
            <v-text-field :readonly="readonly" v-model="model.password" label="Contraseña" variant="outlined"
              :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="passwordVisible ? 'text' : 'password'" @click:append-inner="passwordVisible = !passwordVisible">
              <template #append>
                <v-btn density="comfortable" icon="mdi-content-copy" variant="text" @click="copyPassword"
                  :disabled="!model.password" v-tooltip:top="'Copiar contraseña'" />
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-snackbar v-model="showCopiedSnackbar" color="success" timeout="2000">
          Contraseña copiada al portapapeles
        </v-snackbar>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { CreateUserRequest, UpdateUserRequest } from '@/types/users.types'
import type { VForm } from 'vuetify/components'
import RolesSelect from './RolesSelect.vue'

const props = defineProps({
  readonly: { type: Boolean, default: false },
  title: { type: String, default: 'Datos del usuario' },
  showRole: { type: Boolean, default: false },
  showPassword: { type: Boolean, default: false }
})

const showCopiedSnackbar = ref(false)
const passwordVisible = ref(false)

type UserFormModel = CreateUserRequest & Partial<UpdateUserRequest>

const model = defineModel<UserFormModel>({ required: true })

const required = (v: string) => !!v || 'Campo requerido'
const emailRule = (v: string) => /.+@.+\..+/.test(v) || 'Correo inválido'

const formRef = ref<VForm>()

const copyPassword = () => {
  if (!model.value.password) return
  navigator.clipboard.writeText(model.value.password)
  showCopiedSnackbar.value = true
}

const validate = async () => {
  if (props.readonly) return { valid: true }
  return await formRef.value?.validate()
}

defineExpose({ validate })
</script>
