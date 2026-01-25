<template>
  <page-header title="Nuevo Rol"
    subtitle="Define los detalles del nuevo rol, establece su nivel de acceso y asigna los permisos correspondientes por módulo.">
    <template #actions>
      <v-btn @click="handleCancel">
        Cancelar
      </v-btn>
      <v-btn @click="handleSave">
        Guardar
      </v-btn>
    </template>
  </page-header>

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

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue'
import { useRolesStore } from '@/stores/roles.store'
import type { CreateRoleRequest } from '@/types/roles.types'
import { reactive, ref, type Reactive } from 'vue'

const formRef = ref()
const isValid = ref(false)

const required = (v: string) => !!v || 'Campo requerido'

const form: Reactive<CreateRoleRequest> = reactive({
  name: '',
  description: ''
})

const rolesStore = useRolesStore()
const router = useRouter()

const handleSave = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  await rolesStore.createRole(form)
  router.push('/roles')
}

const handleCancel = router.back
</script>
