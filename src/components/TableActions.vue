<template>
  <div class="d-flex ga-2 justify-end align-center">

    <template v-for="actionItem in order" :key="actionItem">

      <v-tooltip v-if="actionItem === 'soft-delete' && canSoftDelete" :text="isActive ? 'Desactivar' : 'Restaurar'"
        location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon variant="text" size="small" :color="isActive ? 'error' : 'success'"
            @click="$emit('soft-delete', id)">
            <v-icon :icon="isActive ? 'mdi-delete' : 'mdi-delete-restore'" />
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip v-if="actionItem === 'hard-delete' && canHardDelete" text="Eliminar definitivamente" location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon variant="text" size="small" color="error" @click="$emit('hard-delete', id)">
            <v-icon icon="mdi-delete-forever" />
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip v-if="actionItem === 'edit' && canEdit" text="Editar" location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon variant="text" size="small" color="primary" @click="$emit('edit', id)">
            <v-icon icon="mdi-pencil" />
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip v-if="actionItem === 'view' && canView" text="Ver detalles" location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon variant="text" size="small" color="info" @click="$emit('view', id)">
            <v-icon icon="mdi-eye" />
          </v-btn>
        </template>
      </v-tooltip>

      <slot v-if="!isStandardAction(actionItem)" :name="actionItem" :id="id" :is-active="isActive"></slot>

    </template>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  id: { type: [Number, String], required: true },
  isActive: { type: Boolean, default: true },

  canEdit: { type: Boolean, default: true },
  canView: { type: Boolean, default: true },
  canSoftDelete: { type: Boolean, default: true },
  canHardDelete: { type: Boolean, default: false },

  order: {
    type: Array as PropType<string[]>,
    default: () => ['view', 'edit', 'soft-delete', 'hard-delete']
  }
})

defineEmits(['view', 'edit', 'soft-delete', 'hard-delete'])

const isStandardAction = (name: string) => {
  return ['view', 'edit', 'soft-delete', 'hard-delete'].includes(name)
}
</script>
