<template>
  <v-row>
    <v-col cols="12">
      <page-header
        :title="`Permisos del Rol: ${role?.name}`"
        subtitle="Configuración de permisos"
        :back-route="{ name: '/roles/' }"
        back-text="Roles"
      >
        <template #actions>
          <v-btn variant="tonal" prepend-icon="mdi-filter-variant" @click="filtersOpen = true">
            Filtros
            <v-badge
              v-if="activeFilterCount > 0"
              :content="activeFilterCount"
              color="primary"
              floating
            />
          </v-btn>
          <v-btn
            v-if="can('roles:edit')"
            color="primary"
            variant="flat"
            @click="handleSave"
          >
            Guardar
          </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-data-table-server
        v-model:page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        item-value="name"
        hover
        @update:options="loadItems"
        disable-sort
      >
        <template #[`item.assigned`]="{ item }">
          <v-checkbox
            :model-value="isAssigned(item)"
            color="primary"
            density="compact"
            hide-details
            @update:model-value="togglePermission(item)"
          />
        </template>
      </v-data-table-server>
    </v-col>
  </v-row>

  <TheFilters
    v-model="filtersOpen"
    :applied-filters="currentFilters"
    :show-status="false"
    @apply="onFiltersApply"
  />
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import TheFilters from '@/components/TheFilters.vue';
import { usePermissionsStore } from '@/stores/permissions.store';
import { useRolesStore } from '@/stores/roles.store';
import type { Permission } from '@/types/permissions.types';
import type { Role } from '@/types/roles.types';
import type { Filters } from '@/types/filters.types';
import type { DataTableOptions } from '@/types/table.types';
import type { DataTableHeader } from 'vuetify';
import { useUserStore } from '@/stores/user.store';

definePage({
  props: true,
  meta: {
    permission: 'permissions:view'
  }
})
const props = defineProps<{ id: string }>()

const { can } = useUserStore()

const rolesStore = useRolesStore()
const permissionsStore = usePermissionsStore()
const role = ref<Role>()

onMounted(async () => {
  if (props.id) {
    role.value = await rolesStore.getRole(Number(props.id))
  }
})

const headers: DataTableHeader[] = [
  { title: 'Codigo', key: 'name', align: 'start', width: '200px' },
  { title: 'Título', key: 'publicName', align: 'start' },
  { title: 'Descripción', key: 'description', align: 'start' },
  { title: 'Habilitado', key: 'assigned', align: 'center', width: '100px' },
]

const toAdd = ref<number[]>([])
const toRemove = ref<number[]>([])

const isAssigned = (permission: Permission) => {
  const inStore = role.value?.permissions.some((p: any) => p.id === permission.id)

  if (toAdd.value.includes(permission.id)) return true
  if (toRemove.value.includes(permission.id)) return false

  return inStore
}

const togglePermission = async (permission: Permission) => {
  const id = permission.id
  const isCurrentlyAssigned = role.value?.permissions.some((p: any) => p.id === id)

  if (isCurrentlyAssigned) {
    const index = toRemove.value.indexOf(id)
    if (index > -1) {
      toRemove.value.splice(index, 1)
    } else {
      toRemove.value.push(id)
    }
  } else {
    const index = toAdd.value.indexOf(id)
    if (index > -1) {
      toAdd.value.splice(index, 1)
    } else {
      toAdd.value.push(id)
    }
  }
}

const itemsPerPage = ref(10)
const currentPage = ref(1)
const serverItems = ref<Permission[]>([])
const loading = ref(true)
const totalItems = ref(0)
const filtersOpen = ref(false)
const currentFilters = ref<Filters>({})

const activeFilterCount = computed(() =>
  Object.values(currentFilters.value).filter(v => v != null && v !== '').length
)

const loadItems = async ({ page, itemsPerPage }: DataTableOptions) => {
  loading.value = true
  const response = await permissionsStore.getPermissions(page, itemsPerPage, currentFilters.value.search)

  serverItems.value = response.permissions
  totalItems.value = response.total
  loading.value = false
}

const onFiltersApply = async (filters: Filters) => {
  currentFilters.value = filters
  if (currentPage.value !== 1) {
    currentPage.value = 1
  } else {
    await loadItems({ page: 1, itemsPerPage: itemsPerPage.value })
  }
}

const handleSave = async () => {
  if (toAdd.value.length > 0) {
    await rolesStore.addPermission(Number(props.id), toAdd.value)
  }
  if (toRemove.value.length > 0) {
    await rolesStore.removePermission(Number(props.id), toRemove.value)
  }

  role.value = await rolesStore.getRole(Number(props.id))

  toAdd.value = []
  toRemove.value = []
}
</script>
