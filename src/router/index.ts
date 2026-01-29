/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

import { useAuthStore } from '@/stores/auth.store'
import { useUserStore } from '@/stores/user.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})


router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (!authStore.hydrated) {
    return false
  }

  const isPublic = to.meta.public === true
  const isAuthenticated = authStore.isAuthenticated

  if (!isPublic && !isAuthenticated) {
    return {
      path: '/login',
      query: { redirect: to.fullPath }
    }
  }

  if (isPublic && isAuthenticated && to.path === '/login') {
    return { path: '/' }
  }

  if (isAuthenticated) {
    const requiredPermission = to.meta.permission as string | undefined
    const userStore = useUserStore()
    if (requiredPermission && !userStore.can(requiredPermission)) {
      return {
        path: '/403',
        replace: true,
        state: {
          fromPath: to.fullPath,
          requiredPermission: requiredPermission,
          resourceName: to.name
        }
      }
    }
  }
})

export default router
