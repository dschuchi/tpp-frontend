<template>
  <v-row>
    <v-col cols="12" class="d-flex justify-space-between align-center">
      <div>
        <h1>
          Editar Rol
        </h1>
        <p class="text-subtitle-1 font-weight-light text-medium-emphasis">
          Actualice los detalles del nuevo rol, establece su nivel de acceso y asigna los permisos correspondientes por
          módulo.
        </p>
      </div>

      <div class="d-flex ga-2">
        <v-btn @click="handleCancel">
          Cancelar
        </v-btn>
        <v-btn @click="handleSave">
          Guardar
        </v-btn>
      </div>
    </v-col>
  </v-row>


  <v-row>
    <v-col cols="12">
      <v-card title="Datos del rol">
        <v-card-text>
          <v-form ref="formRef" v-model="isValid">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="form.name" label="Nombre del rol" variant="outlined" :rules="[required]" />
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="form.description" label="Descripción" variant="outlined" rows="2"
                  :rules="[required]" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useRolesStore } from '@/stores/roles.store'
import type { CreateRoleRequest } from '@/types/roles.types'
import { reactive, ref, type Reactive } from 'vue'
import { useRouter } from 'vue-router'

definePage({
  props: true
})

defineProps<{
  id: string
}>()

const router = useRouter()

const formRef = ref()
const isValid = ref(false)
const form: Reactive<CreateRoleRequest> = reactive({
  name: '',
  description: ''
})

onMounted(()=>{
  form.name = 'TBD'
  form.description = 'TBD'
})

const required = (v: string) => !!v || 'Campo requerido'

const handleSave = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  alert('TBD')
}

const handleCancel = router.back
</script>
