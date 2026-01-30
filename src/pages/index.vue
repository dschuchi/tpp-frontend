<template>
  <v-row>
    <v-col cols="12">
      <PageHeader title="Inicio"></PageHeader>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue';

definePage({
  meta: {
    permission: '*'
  }
})
</script>
