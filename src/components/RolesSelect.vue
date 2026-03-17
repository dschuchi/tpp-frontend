<template>
  <v-autocomplete
    v-model="internalValue"
    v-model:search="searchText"
    :items="roles"
    :loading="loading"
    item-title="name"
    item-value="id"
    label="Rol"
    return-object
    :no-filter="true"
    @update:search="onSearchChange"
  >
    <template #append-item>
      <v-divider class="mb-2"></v-divider>
      <div class="pa-2 d-flex justify-center">
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="3"
          density="compact"
          @update:model-value="loadRoles"
        ></v-pagination>
      </div>
    </template>

    <template #no-data>
      <v-list-item>
        <v-list-item-title>No se encontraron roles</v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRolesStore } from '@/stores/roles.store'

interface Role {
  id: number
  name: string
}

const rol_id = defineModel<number | null>()
const rolesStore = useRolesStore()

const roles = ref<Role[]>([])
const loading = ref(false)
const searchText = ref('')
const page = ref(1)
const totalItems = ref(0)
const itemsPerPage = 10

const internalValue = computed({
  get() {
    if (!rol_id.value) return null
    return roles.value.find(r => r.id === rol_id.value) || { id: rol_id.value, name: '...' }
  },
  set(val: Role | null) {
    rol_id.value = val ? val.id : null
  }
})

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage) || 1
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const loadRoles = async () => {
  loading.value = true
  try {
    const response = await rolesStore.getRoles(page.value, itemsPerPage, { name: searchText.value })

    roles.value = response.roles
    totalItems.value = response.total
  } catch (error) {
    console.error('Error cargando roles:', error)
    totalItems.value = 0
  } finally {
    loading.value = false
  }
}

const onSearchChange = (val: string) => {
  if (debounceTimer) clearTimeout(debounceTimer)

  debounceTimer = setTimeout(() => {
    page.value = 1
    loadRoles()
  }, 500)
}

onMounted(() => {
  loadRoles()
})
</script>
