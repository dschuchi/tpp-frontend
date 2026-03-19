<template>
  <v-select
    v-model="internalValue"
    :items="items"
    :loading="loading"
    :item-title="itemTitle"
    :item-value="itemValue"
    :label="label"
    return-object
  >
    <template #selection="{ item }">
      {{ (item.raw as T)[itemTitle] }}
    </template>

    <template #menu-header>
      <v-container>
        <v-text-field
          v-model="search"
          :label="`Buscar ${label.toLowerCase()}`"
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
          total-visible="1"
        />
      </v-container>
    </template>
  </v-select>
</template>

<script setup lang="ts" generic="T extends { id: number | string }">
import { ref, computed, watch, onMounted } from 'vue'

export interface Props<T> {
  modelValue?: number | string | null
  label: string
  itemTitle: keyof T & string
  itemValue?: keyof T & string
  loadFn: (page: number, search: string) => Promise<{ items: T[], total: number }>
  fetchByIdFn: (id: number | string) => Promise<T | undefined>
}

const props = defineProps<Props<T>>()
const emit = defineEmits(['update:modelValue'])

const items = ref<T[]>([]) as any
const loading = ref(false)
const search = ref('')
const page = ref(1)
const totalItems = ref(0)
const itemsPerPage = 5

const internalValue = ref<T | null>(null)

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage) || 1)

watch(() => props.modelValue, async (newId) => {
  if (newId && internalValue.value?.id !== newId) {
    const item = await props.fetchByIdFn(newId)
    if (item) internalValue.value = item
  } else if (!newId) {
    internalValue.value = null
  }
}, { immediate: true })

watch(internalValue, (newVal) => {
  const newId = newVal ? (newVal as any)[props.itemValue || 'id'] : null
  if (newId !== props.modelValue) {
    emit('update:modelValue', newId)
  }
})

const load = async () => {
  loading.value = true
  try {
    const res = await props.loadFn(page.value, search.value)
    items.value = res.items
    totalItems.value = res.total
  } finally {
    loading.value = false
  }
}

let timer: ReturnType<typeof setTimeout> | undefined
const onSearch = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    page.value = 1
    load()
  }, 400)
}

onMounted(load)
</script>
