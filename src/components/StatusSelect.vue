<template>
  <v-select
    v-model="model"
    :items="statusOptions"
    label="Estado"
    variant="outlined"
    clearable
    hide-details
  ></v-select>
</template>

<script lang="ts" setup>
const model = defineModel<boolean | null>();

const statusOptions = [
  { title: 'Todos', value: null },
  { title: 'Activo', value: true },
  { title: 'Inactivo', value: false }
];
</script>
