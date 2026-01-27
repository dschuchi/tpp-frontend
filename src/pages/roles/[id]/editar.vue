<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Editar Rol"
        subtitle="Actualice los detalles del nuevo rol, establece su nivel de acceso y asigna los permisos correspondientes por módulo."
        back-route="/roles" back-text="Roles">
        <template #actions>
          <v-btn @click="handleCancel">
            Cancelar
          </v-btn>
          <v-btn @click="handleSave">
            Guardar
          </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <role-form ref="roleFormRef" v-model="form" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import RoleForm from '@/components/RoleForm.vue'
import { useRolesStore } from '@/stores/roles.store'
import type { UpdateRoleRequest } from '@/types/roles.types'
import { useRouter } from 'vue-router'

definePage({ props: true })
const props = defineProps<{ id: string }>()

const router = useRouter()
const roleFormRef = ref()

const form = ref<UpdateRoleRequest>({
  name: '',
  description: ''
})

const rolesStore = useRolesStore()

onMounted(async () => {
  await rolesStore.getRole(Number(props.id))
  form.value.name = rolesStore.role ? rolesStore.role.name : ''
  form.value.description = rolesStore.role ? rolesStore.role.description : ''
})

const handleSave = async () => {
  const { valid } = await roleFormRef.value.validate()
  if (!valid) return

  await rolesStore.updateRole(Number(props.id), form.value)
  router.push({ name: '/roles/' })
}

const handleCancel = router.back
</script>
