<template>
  <v-container fluid class="pa-0 fill-height fill-width">
    <LoginForm />
  </v-container>
</template>

<script lang="ts" setup>
definePage({
  meta: {
    layout: 'blank',
    public: true,
    permission: '*'
  }
})
</script>
