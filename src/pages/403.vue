<template>
  <v-empty-state icon="mdi-shield-lock" headline="Acceso Denegado">
    <template #text>
      <p>No tienes permisos para acceder al recurso.</p>

      <v-alert v-if="errorState.requiredPermission" type="warning" variant="tonal" class="mt-4">
        Permiso faltante: <strong>{{ errorState.requiredPermission }}</strong>
      </v-alert>

      <div class="text-caption text-grey mt-2">
        Intento de acceso a: {{ errorState.fromPath }}
      </div>
    </template>

    <template #actions>
      <v-btn to="/" color="primary">Volver al Inicio</v-btn>
    </template>
  </v-empty-state>
</template>

<script setup lang="ts">
definePage({
  meta: {
    permission: '*'
  }
})

const errorState = history.state as { requiredPermission?: string, fromPath?: string };
</script>
