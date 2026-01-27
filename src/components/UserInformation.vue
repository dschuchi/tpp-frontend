<template>
  <v-card :title="userStore.fullname" :subtitle="userStore.rol_name" variant="flat">
    <template v-slot:append>
      <v-avatar color="blue">
        {{ avatarText }}
      </v-avatar>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user.store';

const userStore = useUserStore()
const avatarText = computed(() => userStore.name.charAt(0) + userStore.lastname.charAt(0))
</script>
