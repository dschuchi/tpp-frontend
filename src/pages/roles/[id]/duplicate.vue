<template>
  <v-row>
    <v-col cols="12">
      <page-header :title="title"
        subtitle="Crea un nuevo rol basado en uno existente, ajustando los detalles y permisos según sea necesario."
        :back-route="{name:'/roles/'}" back-text="Roles">
        <template #actions>
          <v-btn @click="handleCancel"> Cancelar </v-btn>
          <v-btn color="primary" :loading="saving" @click="handleSave"> Guardar </v-btn>
        </template>
      </page-header>
    </v-col>
  </v-row>

  <v-row v-if="loading">
    <v-col cols="12" class="text-center">
      <v-progress-circular indeterminate color="primary" />
    </v-col>
  </v-row>

  <v-row v-else>
    <v-col cols="12">
      <role-form ref="roleFormRef" v-model="form" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/PageHeader.vue'
import RoleForm from '@/components/RoleForm.vue'
import { useRolesStore } from '@/stores/roles.store'
import type { CreateRoleRequest, Role } from '@/types/roles.types'
import { useSnackbarStore } from '@/stores/snackbar.store'

definePage({
  meta: {
    permission: 'roles:create'
  }
})

const route = useRoute('/roles/[id]/duplicate')
const router = useRouter()
const rolesStore = useRolesStore()
const snackbarStore = useSnackbarStore()

const roleFormRef = ref()
const loading = ref(true)
const saving = ref(false)

const form = ref<CreateRoleRequest>({
  name: '',
  description: ''
})

const role = ref<Role | null>(null)
const title = computed(() => role.value ? `Duplicar Rol - ${role.value.name}` : 'Duplicar Rol')

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    role.value = await rolesStore.getRole(id)
    form.value = {
      name: `${role.value.name} (copia)`,
      description: role.value.description
    }
  } catch (error) {
    snackbarStore.showMessage({ message: 'Ocurrió un error al cargar los datos del rol', color: 'error' })
    router.push({ name: '/roles/' })
  } finally {
    loading.value = false
  }
})

const handleSave = async () => {
  const { valid } = await roleFormRef.value.validate()
  if (!valid) return

  saving.value = true
  const id = Number(route.params.id)
  try {
    await rolesStore.duplicateRole(id, form.value)
    snackbarStore.showMessage({ message: 'Rol duplicado exitosamente', color: 'success' })
    router.push({ name: '/roles/' })
  } catch (error) {
    snackbarStore.showMessage({ message: 'Ocurrió un error al duplicar el rol', color: 'error' })
  } finally {
    saving.value = false
  }
}

const handleCancel = () => router.push({ name: '/roles/' })
</script>
