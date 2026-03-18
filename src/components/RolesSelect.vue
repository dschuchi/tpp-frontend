<template>
  <v-select
    v-model="selectedRole"
    :items="roles"
    :loading="loading"
    item-title="name"
    item-value="id"
    label="Rol"
    return-object
  >
    <template #selection="{ item }">
      {{ item.raw.name }}
    </template>

    <template #menu-header>
      <v-container>
        <v-text-field
          v-model="search"
          label="Buscar rol"
          hide-details
          prepend-inner-icon="mdi-magnify"
          @input="onSearch"
          color="success"
        />
      </v-container>
    </template>

    <template #menu-footer>
      <v-container>
        <v-pagination
          v-model="page"
          :length="totalPages"
          density="compact"
          @update:model-value="load"
        />
      </v-container>
    </template>
  </v-select>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRolesStore } from '@/stores/roles.store'
import type { Role } from '@/types/roles.types'

const rol_id = defineModel<number>()
const rolesStore = useRolesStore()

const roles = ref<Role[]>([])
const loading = ref(false)
const search = ref('')
const page = ref(1)
const totalItems = ref(0)
const selectedRole = ref<Role | null>(null)
const itemsPerPage = ref(5)

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value) || 1)

watch(rol_id, async (newId) => {
  if (newId && selectedRole.value?.id !== newId) {
    const role = await rolesStore.getRole(newId)
    if (role) selectedRole.value = role
  }
}, { immediate: true })

watch(selectedRole, (newVal) => {
  if (newVal && newVal.id !== rol_id.value) {
    rol_id.value = newVal.id
  }
})

const load = async () => {
  loading.value = true
  try {
    const res = await rolesStore.getRoles(page.value, itemsPerPage.value, { name: search.value })
    roles.value = res.roles
    totalItems.value = res.total
  } finally {
    loading.value = false
  }
}

let timer: ReturnType<typeof setTimeout> | undefined;
const onSearch = () => {
  clearTimeout(timer)
  timer = setTimeout(() => { page.value = 1; load(); }, 400)
}

onMounted(load)
</script>
