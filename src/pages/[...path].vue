<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-empty-state icon="mdi-map-search-outline" headline="404 - Página no encontrada"
      title="Parece que te has perdido">
      <template #text>
        <div class="text-medium-emphasis mb-4">
          La ruta <strong>{{ $route.path }}</strong> no existe en este sistema.
        </div>
      </template>

      <template #actions>
        <v-btn to="/" color="primary" variant="flat">
          Volver al Inicio
        </v-btn>
      </template>
    </v-empty-state>
  </v-container>
</template>

<script setup lang="ts">
definePage({
  meta: {
    permission: '*',
  }
})
</script>
