<template>
  <v-card to="/profile" :title="userStore.fullname" :subtitle="userStore.rol_name"
    variant="flat" class="user-info-card" rounded="lg">
    <template v-slot:append>
      <v-avatar color="primary" size="36" class="user-avatar">
        <span class="text-caption font-weight-bold">{{ avatarText }}</span>
      </v-avatar>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user.store';

const userStore = useUserStore()
const avatarText = computed(() => userStore.name.charAt(0) + userStore.lastname.charAt(0))
</script>

<style scoped>
.user-info-card {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  transition: background-color 0.2s ease !important;
}

.user-info-card:hover {
  background: rgba(var(--v-theme-primary), 0.06) !important;
  transform: none !important;
  box-shadow: none !important;
}

.user-avatar {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 1) 0%, rgba(var(--v-theme-secondary), 0.9) 100%);
}
</style>
