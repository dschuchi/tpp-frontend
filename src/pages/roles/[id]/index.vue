<template>
  <page-header title="Detalle del Rol" subtitle="Visualización de permisos y datos." />

  <v-row>
    <v-col cols="12">
      <role-form v-model="form" readonly />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import RoleForm from '@/components/RoleForm.vue';
import type { CreateRoleRequest } from '@/types/roles.types'
import { reactive, type Reactive } from 'vue'

definePage({ props: true })
defineProps<{ id: string }>()

const form = reactive<CreateRoleRequest>({
  name: '',
  description: ''
})

onMounted(() => {
  form.name = 'TBD'
  form.description = 'TBD'
})
</script>
