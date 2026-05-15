<template>
  <v-row>
    <v-col cols="12">
      <PageHeader
        title="Usuarios"
        subtitle="Administra los usuarios del sistema."
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
            v-if="can('users:create')"
            to="/users/new"
          >
            Nuevo Usuario
          </v-btn>
        </template>
      </PageHeader>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-data-table-server
        v-model:page="currentPage"
        :headers="headers"
        v-model:items-per-page="itemsPerPage"
        :items="users"
        :items-length="totalItems"
        :loading="loading"
        hover
        @update:options="loadItems"
      >
        <template #item.is_active="{ value }">
          <StatusChip :value="value" />
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end align-center">
            <v-tooltip
              :text="item.is_active ? 'Desactivar' : 'Restaurar'"
              location="top"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  v-if="can('users:delete')"
                  v-bind="props"
                  icon
                  variant="text"
                  size="small"
                  :color="item.is_active ? 'error' : 'success'"
                  @click="toggleStatus(item)"
                >
                  <v-icon :icon="item.is_active ? 'mdi-delete' : 'mdi-delete-restore'" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip
              text="Editar"
              location="top"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  v-if="can('users:edit:all')"
                  v-bind="props"
                  icon
                  variant="text"
                  size="small"
                  color="primary"
                  @click="editUser(item.id)"
                >
                  <v-icon icon="mdi-pencil" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip
              text="Ver detalles"
              location="top"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  v-if="can('users:edit:all')"
                  v-bind="props"
                  icon
                  variant="text"
                  size="small"
                  color="info"
                  @click="viewUser(item.id)"
                >
                  <v-icon icon="mdi-eye" />
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table-server>
    </v-col>
  </v-row>

  <TheFilters
    v-model="filtersOpen"
    :applied-filters="currentFilters"
    @apply="onFiltersApply"
  />
</template>

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue';
import TheFilters from '@/components/TheFilters.vue';
import { useConfirm } from '@/composables/useConfirm';
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.store';
import { useUsersStore } from '@/stores/users.store';
import type { UserListItem } from '@/types/users.types';
import type { Filters } from '@/types/filters.types';
import type { DataTableHeader } from 'vuetify';
import type { DataTableOptions } from '@/types/table.types';

definePage({
  meta: {
    permission: 'users:edit:all'
  }
})

const usersStore = useUsersStore()
const { can } = useUserStore()

const headers: DataTableHeader[] = [
  { title: 'Legajo', key: 'employee_id' },
  { title: 'Nombre', key: 'username' },
  { title: 'Apellido', key: 'lastname' },
  { title: 'Correo', key: 'email' },
  { title: 'Rol', key: 'rol_name' },
  { title: 'Estado', key: 'is_active' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const router = useRouter()
const viewUser = (id: string) => router.push({ name: '/users/[id]/', params: { id } })
const editUser = (id: string) => router.push({ name: '/users/[id]/edit', params: { id } })

const { confirm } = useConfirm()

const toggleStatus = async (item: UserListItem) => {
  const { id } = item
  const isDeactivating = item.is_active

  const ok = await confirm({
    title: isDeactivating ? 'Desactivar usuario' : 'Activar usuario',
    message: `¿Estás seguro de que querés ${isDeactivating ? 'desactivar' : 'activar'} este usuario?`,
    confirmText: isDeactivating ? 'Desactivar' : 'Activar',
    confirmColor: isDeactivating ? 'error' : 'success'
  })

  if (ok) {
    isDeactivating ? usersStore.deactivateUser(id) : usersStore.activateUser(id)
    item.is_active = !item.is_active
  }
}

const itemsPerPage = ref(10)
const currentPage = ref(1)
const users = ref<UserListItem[]>([])
const loading = ref(true)
const totalItems = ref(0)
const filtersOpen = ref(false)
const currentFilters = ref<Filters>({})

const activeFilterCount = computed(() =>
  Object.values(currentFilters.value).filter(v => v != null && v !== '').length
)

const loadItems = async ({ page, itemsPerPage }: DataTableOptions) => {
  loading.value = true
  const response = await usersStore.getUsers(page, itemsPerPage, currentFilters.value)

  users.value = response.users
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
</script>
