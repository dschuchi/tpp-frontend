<template>
  <div class="d-flex ga-2 justify-end align-center">

    <template v-for="action in order" :key="action">

      <v-tooltip v-if="action === 'soft-delete'" :text="isActive ? 'Desactivar' : 'Restaurar'" location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon variant="text" size="small" :color="isActive ? 'error' : 'success'"
            @click="$emit('soft-delete', id)">
            <v-icon :icon="isActive ? 'mdi-delete' : 'mdi-delete-restore'" />
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip v-else-if="action === 'hard-delete'" text="Eliminar definitivamente" location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon variant="text" size="small" color="error" @click="$emit('hard-delete', id)">
            <v-icon icon="mdi-delete-forever" />
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip v-else-if="action === 'edit'" text="Editar" location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon variant="text" size="small" color="primary" @click="$emit('edit', id)">
            <v-icon icon="mdi-pencil" />
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip v-else-if="action === 'view'" text="Ver detalles" location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon variant="text" size="small" color="info" @click="$emit('view', id)">
            <v-icon icon="mdi-eye" />
          </v-btn>
        </template>
      </v-tooltip>

      <slot v-else :name="action" :id="id" :is-active="isActive"></slot>

    </template>
  </div>
</template>

<script setup lang="ts" generic="CustomSlots extends string = never">
import type { PropType } from 'vue'

type StandardAction = 'view' | 'edit' | 'soft-delete' | 'hard-delete'

type ActionItem = StandardAction | CustomSlots

defineProps({
  id: { type: [Number, String], required: true },
  isActive: { type: Boolean, default: true },

  order: {
    type: Array as PropType<ActionItem[]>,
    default: () => ['soft-delete', 'edit', 'view']
  }
})

defineEmits(['view', 'edit', 'soft-delete', 'hard-delete'])
</script>
