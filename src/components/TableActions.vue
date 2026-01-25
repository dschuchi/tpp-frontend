<template>
  <div class="d-flex ga-2 justify-end align-center">

    <slot name="prepend" :id="id"></slot>

    <v-tooltip v-if="canSoftDelete" :text="isActive ? 'Desactivar' : 'Restaurar'" location="top">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon variant="text" size="small" :color="isActive ? 'error' : 'success'"
          @click="$emit('softDelete', id)">
          <v-icon :icon="isActive ? 'mdi-delete' : 'mdi-delete-restore'" />
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip v-if="canHardDelete" text="Eliminar definitivamente" location="top">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon variant="text" size="small" color="error" @click="$emit('hardDelete', id)">
          <v-icon icon="mdi-delete-forever" />
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip v-if="canEdit" text="Editar" location="top">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon variant="text" size="small" color="primary" @click="$emit('edit', id)">
          <v-icon icon="mdi-pencil" />
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip v-if="canView" text="Ver detalles" location="top">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon variant="text" size="small" color="info" @click="$emit('view', id)">
          <v-icon icon="mdi-eye" />
        </v-btn>
      </template>
    </v-tooltip>

    <slot name="append" :id="id"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: { type: [Number, String], required: true },
  isActive: { type: Boolean, default: true },

  canEdit: { type: Boolean, default: true },
  canView: { type: Boolean, default: true },
  canSoftDelete: { type: Boolean, default: true },
  canHardDelete: { type: Boolean, default: false }
})

defineEmits(['view', 'edit', 'softDelete', 'hardDelete'])
</script>
