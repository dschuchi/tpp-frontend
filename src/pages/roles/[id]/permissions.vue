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
          <v-btn
            @click="handleSave"
            color="primary"
            variant="flat"
          >
            Guardar
          </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-form @submit.prevent="handleSearch">
        <v-text-field
          v-model="searchInput"
          label="Nombre"
          clearable
          @click:clear="activeSearch = ''"
        >
          <template #append>
            <v-btn
              prepend-icon="mdi-magnify"
              size="large"
              @click="handleSearch"
            > Buscar </v-btn>
          </template>
        </v-text-field>
      </v-form>

      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        :search="activeSearch"
        item-value="name"
        hover
        @update:options="loadItems"
        disable-sort
      >
        <template #[`item.assigned`]="{ item }">
          <v-checkbox
            :model-value="isAssigned(item)"
            @update:model-value="togglePermission(item)"
            color="primary"
            density="compact"
            hide-details
          ></v-checkbox>
        </template>
      </v-data-table-server>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import { usePermissionsStore } from '@/stores/permissions.store';
import { useRolesStore } from '@/stores/roles.store';
import type { Permission } from '@/types/permissions.types';
import type { Role } from '@/types/roles.types';
import type { DataTableOptions } from '@/types/table.types';
import type { DataTableHeader } from 'vuetify';

definePage({
  props: true,
  meta: {
    permission: 'roles:edit'
  }
})
const props = defineProps<{ id: string }>()

const rolesStore = useRolesStore()
const permissionsStore = usePermissionsStore()
const role = ref<Role>()

onMounted(async () => {
  if (props.id) {
    role.value = await rolesStore.getRole(Number(props.id))
  }
})

const activeSearch = ref('')
const searchInput = ref('')

const handleSearch = () => {
  activeSearch.value = searchInput.value
}

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
const serverItems = ref<Permission[]>([])
const loading = ref(true)
const totalItems = ref(0)

const loadItems = async ({ page, itemsPerPage, search }: DataTableOptions) => {
  loading.value = true
  const response = await permissionsStore.getPermissions(page, itemsPerPage, search)

  serverItems.value = response.permissions
  totalItems.value = response.total
  loading.value = false
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
