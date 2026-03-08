<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Detalle del Rol" subtitle="Visualización de permisos y datos." :back-route="{name:'/roles/'}"
        back-text="Roles" />
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <role-form v-model="form" readonly />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import RoleForm from '@/components/RoleForm.vue';
import { useRolesStore } from '@/stores/roles.store';
import type { CreateRoleRequest } from '@/types/roles.types'

definePage({
  props: true,
  meta: {
    permission: 'roles:view'
  }
})
const props = defineProps<{ id: string }>()

const form = ref<CreateRoleRequest>({
  name: '',
  description: ''
})

const rolesStore = useRolesStore()

onMounted(async () => {
  await rolesStore.getRole(Number(props.id))
  form.value.name = rolesStore.role ? rolesStore.role.name : ''
  form.value.description = rolesStore.role ? rolesStore.role.description : ''
})
</script>
