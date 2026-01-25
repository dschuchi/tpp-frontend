<template>
  <page-header title="Editar Rol"
    subtitle="Actualice los detalles del nuevo rol, establece su nivel de acceso y asigna los permisos correspondientes por módulo.">
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
      <role-form ref="roleFormRef" v-model="form" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import RoleForm from '@/components/RoleForm.vue'
import type { CreateRoleRequest } from '@/types/roles.types'
import { useRouter } from 'vue-router'

definePage({ props: true })
defineProps<{ id: string }>()

const router = useRouter()
const roleFormRef = ref()

const form = ref<CreateRoleRequest>({
  name: '',
  description: ''
})

onMounted(() => {
  form.value.name = 'TBD'
  form.value.description = 'TBD'
})

const handleSave = async () => {
  const { valid } = await roleFormRef.value.validate()
  if (!valid) return

  alert('TBD')
}

const handleCancel = router.back
</script>
