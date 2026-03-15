<template>
  <v-row>
    <v-col cols="12">
      <PageHeader
        title="Usuarios"
        subtitle="Administra los usuarios del sistema."
      >
        <template #actions>
          <div class="d-flex align-center ga-3">

            <v-badge
              :content="activeFiltersCount"
              :model-value="activeFiltersCount > 0"
              color="error"
            >
              <v-btn
                prepend-icon="mdi-magnify"
                variant="outlined"
                color="primary"
                @click="isFilterDrawerOpen = true"
              >
                Buscar
              </v-btn>
            </v-badge>

            <v-btn
              v-if="can('users:create')"
              to="/users/new"
              color="primary"
              prepend-icon="mdi-plus"
            >
              Nuevo Usuario
            </v-btn>

          </div>
        </template>
      </PageHeader>
    </v-col>
  </v-row>


  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <v-data-table-server
            :headers="headers"
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :items="serverItems"
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
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-navigation-drawer
    v-model="isFilterDrawerOpen"
    location="right"
    temporary
    width="350"
    elevation="4"
  >
    <div class="pa-4 d-flex justify-space-between align-center">
      <div class="d-flex align-center">
        <v-icon
          icon="mdi-filter-outline"
          class="mr-2"
          color="primary"
        ></v-icon>
        <span class="text-h6 font-weight-bold">Filtros</span>
      </div>
      <v-btn
        icon="mdi-close"
        variant="text"
        density="comfortable"
        @click="isFilterDrawerOpen = false"
      ></v-btn>
    </div>

    <v-divider></v-divider>

    <div class="pa-4">
      <v-form @submit.prevent="handleSearch">
        <v-text-field
          v-model="filters.legajo"
          label="Legajo"
          variant="outlined"
          density="compact"
          clearable
          class="mb-3"
          hide-details
        ></v-text-field>

        <v-text-field
          v-model="filters.username"
          label="Nombre"
          variant="outlined"
          density="compact"
          clearable
          class="mb-3"
          hide-details
        ></v-text-field>

        <v-text-field
          v-model="filters.lastname"
          label="Apellido"
          variant="outlined"
          density="compact"
          clearable
          class="mb-3"
          hide-details
        ></v-text-field>

        <v-text-field
          v-model="filters.email"
          label="Correo"
          variant="outlined"
          density="compact"
          clearable
          class="mb-3"
          hide-details
        ></v-text-field>

        <v-select
          v-model="filters.rol_name"
          label="Rol"
          :items="['a', 'b', 'c']"
          variant="outlined"
          density="compact"
          clearable
          class="mb-3"
          hide-details
        ></v-select>

        <v-select
          v-model="filters.is_active"
          label="Estado"
          :items="['Activo', 'Inactivo']"
          variant="outlined"
          density="compact"
          clearable
          class="mb-6"
          hide-details
        ></v-select>

        <v-btn
          block
          color="primary"
          type="submit"
          class="mb-3"
          prepend-icon="mdi-magnify"
        >
          Aplicar Filtros
        </v-btn>

        <v-btn
          block
          variant="tonal"
          @click="resetFilters"
          prepend-icon="mdi-filter-off"
        >
          Limpiar Todo
        </v-btn>
      </v-form>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import { useConfirm } from '@/composables/useConfirm';
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.store';
import { useUsersStore } from '@/stores/users.store';
import type { UserListItem } from '@/types/users.types';
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
  { title: 'Legajo', key: 'legajo' },
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
  }
}

const isFilterDrawerOpen = ref(false)

const initialFilters = {
  legajo: '',
  username: '',
  lastname: '',
  email: '',
  rol_name: null,
  is_active: null
}

const filters = reactive({ ...initialFilters })
const activeFilters = ref({ ...initialFilters })

const activeFiltersCount = computed(() => {
  return Object.values(activeFilters.value).filter(val => {
    return val !== null && val !== undefined && val !== '';
  }).length;
})

const page = ref(1)
const itemsPerPage = ref(10)
const serverItems = ref<UserListItem[]>([])
const loading = ref(true)
const totalItems = ref(0)

const loadItems = async ({ page, itemsPerPage }: DataTableOptions) => {
  loading.value = true

  const response = await usersStore.getUsers(
    page,
    itemsPerPage,
    activeFilters.value
  )

  serverItems.value = response.users
  totalItems.value = response.total
  loading.value = false
}

const handleSearch = () => {
  activeFilters.value = { ...filters }
  if (page.value !== 1) {
    page.value = 1
  } else {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value })
  }
  isFilterDrawerOpen.value = false
}

const resetFilters = () => {
  Object.assign(filters, initialFilters)
  handleSearch()
}
</script>
