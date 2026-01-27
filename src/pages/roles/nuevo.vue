<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Nuevo Rol"
        subtitle="Define los detalles del nuevo rol, establece su nivel de acceso y asigna los permisos correspondientes por módulo."
        back-route="/roles" back-text="Roles">
        <template #actions>
          <v-btn @click="handleCancel"> Cancelar </v-btn>
          <v-btn @click="handleSave"> Guardar </v-btn>
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

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue'
import RoleForm from '@/components/RoleForm.vue'
import { useRolesStore } from '@/stores/roles.store'
import type { CreateRoleRequest } from '@/types/roles.types'

const router = useRouter()
const rolesStore = useRolesStore()

const roleFormRef = ref()

const form = ref<CreateRoleRequest>({
  name: '',
  description: ''
})

const handleSave = async () => {
  const { valid } = await roleFormRef.value.validate()
  if (!valid) return

  await rolesStore.createRole(form.value)
  router.push('/roles')
}

const handleCancel = router.back
</script>
