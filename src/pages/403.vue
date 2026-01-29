<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
// history.state contiene lo que enviamos desde el router
const errorState = history.state as { requiredPermission?: string, fromPath?: string };
</script>

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
