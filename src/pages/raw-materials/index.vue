<template>
  <v-row>
    <v-col cols="12">
      <page-header title="Materias Primas" subtitle="Administra las materias primas del sistema.">
        <template #actions>
          <v-btn v-if="can('raw-materials:create')" to="/raw-materials/new">
            Nueva Materia Prima
          </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-data-table-server
        :headers="headers"
        :items="rawMaterials"
        :items-length="totalItems"
        :items-per-page="itemsPerPage"
        :loading="loading"
        hover
        @update:options="loadItems"
      >
        <template #item.is_active="{ value }">
          <status-chip :value="value" />
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end align-center">

            <v-tooltip :text="item.is_active ? 'Desactivar' : 'Restaurar'" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('raw-materials:edit')" v-bind="props" icon variant="text" size="small"
                  :color="item.is_active ? 'error' : 'success'" @click="toggleStatus(item)">
                  <v-icon :icon="item.is_active ? 'mdi-delete' : 'mdi-delete-restore'" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Editar" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-if="can('raw-materials:edit')" v-bind="props" icon variant="text" size="small" color="primary"
                  @click="editRawMaterial(item.id)">
                  <v-icon icon="mdi-pencil" />
                </v-btn>
              </template>
            </v-tooltip>

          </div>
        </template>
      </v-data-table-server>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue';
import { useConfirm } from '@/composables/useConfirm';
import { useRawMaterialsStore } from '@/stores/rawMaterials.store';
import { useUserStore } from '@/stores/user.store';
import type { RawMaterial } from '@/types/rawMaterials.types';
import type { DataTableOptions } from '@/types/table.types';
import type { DataTableHeader } from 'vuetify';

definePage({
  meta: {
    permission: 'raw-materials:view'
  }
})

const { can } = useUserStore()
const rawMaterialsStore = useRawMaterialsStore()

const headers: DataTableHeader[] = [
  { title: 'Nombre', key: 'name' },
  { title: 'Estado', key: 'is_active' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const router = useRouter()
const editRawMaterial = (id: any) => router.push({ name: '/raw-materials/[id]/edit', params: { id } })

const { confirm } = useConfirm()

const toggleStatus = async (item: any) => {
  const { id } = item
  const isDeactivating = item.is_active

  const ok = await confirm({
    title: isDeactivating ? 'Desactivar materia prima' : 'Activar materia prima',
    message: `¿Estás seguro de que querés ${isDeactivating ? 'desactivar' : 'activar'} esta materia prima?`,
    confirmText: isDeactivating ? 'Desactivar' : 'Activar',
    confirmColor: isDeactivating ? 'error' : 'success'
  })

  if (ok) {
    isDeactivating ? await rawMaterialsStore.deactivate(id) : await rawMaterialsStore.activate(id)
    item.is_active = !item.is_active
  }
}

const itemsPerPage = ref(10)
const rawMaterials = ref<RawMaterial[]>([])
const loading = ref(true)
const totalItems = ref(0)

const loadItems = async ({ page, itemsPerPage }: DataTableOptions) => {
  loading.value = true
  const response = await rawMaterialsStore.getRawMaterials(page, itemsPerPage)

  rawMaterials.value = response.rawMaterials
  totalItems.value = response.total
  loading.value = false
}
</script>
