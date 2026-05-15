<template>
  <v-navigation-drawer
    :model-value="modelValue"
    location="end"
    temporary
    width="320"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-list-item nav title="Filtros">
      <template #append>
        <v-btn icon variant="text" @click="$emit('update:modelValue', false)">
          <v-icon icon="mdi-close" />
        </v-btn>
      </template>
    </v-list-item>

    <v-divider />

    <div class="pa-4 d-flex flex-column ga-4">
      <v-text-field
        v-if="showSearch"
        v-model="localFilters.search"
        label="Buscar"
        prepend-inner-icon="mdi-magnify"
        clearable
        hide-details
        variant="outlined"
        density="compact"
      />

      <v-select
        v-if="showStatus"
        v-model="localFilters.is_active"
        label="Estado"
        :items="statusOptions"
        item-title="label"
        item-value="value"
        clearable
        hide-details
        variant="outlined"
        density="compact"
      />
    </div>

    <template #append>
      <div class="pa-4 d-flex flex-column ga-2">
        <v-btn block color="primary" @click="applyFilters">
          Aplicar
        </v-btn>
        <v-btn block variant="text" @click="clearFilters">
          Limpiar filtros
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import type { Filters } from '@/types/filters.types'

const props = withDefaults(defineProps<{
  modelValue: boolean
  appliedFilters?: Filters
  showSearch?: boolean
  showStatus?: boolean
}>(), {
  appliedFilters: () => ({}),
  showSearch: true,
  showStatus: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'apply': [filters: Filters]
}>()

const statusOptions = [
  { label: 'Activos', value: true },
  { label: 'Inactivos', value: false },
]

const localFilters = ref<Filters>({})

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) localFilters.value = { ...props.appliedFilters }
})

const applyFilters = () => {
  const filters: Filters = {}
  if (localFilters.value.search) filters.search = localFilters.value.search
  if (localFilters.value.is_active != null) filters.is_active = localFilters.value.is_active
  emit('apply', filters)
  emit('update:modelValue', false)
}

const clearFilters = () => {
  localFilters.value = {}
  emit('apply', {})
  emit('update:modelValue', false)
}
</script>
