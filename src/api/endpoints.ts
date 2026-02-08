export const USERS_ENDPOINTS = {
  USER: '/user',
  USERS: '/users',
  USER_BY_ID: (id: string) => `/user/${id}`,
  ACTIVATE_USER_BY_ID: (id: string) => `/user/${id}/activate`,
  LOGIN: '/user/login',
  ME: '/user/me'
} as const

export const ROLES_ENDPOINTS = {
  ROLES: '/roles',
  ROLE: '/role',
  ROLE_BY_ID: (id: number) => `/role/${id}`,
  ACTIVATE_ROLE_BY_ID: (id: number) => `/role/${id}/activate`,
  ROLE_PERMISSIONS_BY_ID: (id: number) => `/role/${id}/permissions`
} as const

export const PERMISSIONS_ENDPOINTS = {
  PERMISSIONS: '/permissions'
} as const

export const SUPPLIERS_ENDPOINTS = {
  SUPPLIERS: '/suppliers',
  SUPPLIER_BY_ID: (id: number) => `/suppliers/${id}`,
  ACTIVATE_SUPPLIER_BY_ID: (id: number) => `/suppliers/${id}/activate`
} as const
