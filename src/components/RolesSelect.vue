<template>
  <PaginatedSelect
    v-model="rolId"
    label="Rol"
    item-title="name"
    :load-fn="loadRoles"
    :fetch-by-id-fn="(id) => rolesStore.getRole(Number(id))"
  />
</template>

<script setup lang="ts">
import { useRolesStore } from '@/stores/roles.store'
import PaginatedSelect from './PaginatedSelect.vue'

const rolId = defineModel<number>()

const rolesStore = useRolesStore()

const loadRoles = async (page: number, search: string) => {
  const res = await rolesStore.getRoles(page, 5, { name: search })
  return {
    items: res.roles,
    total: res.total
  }
}
</script>
