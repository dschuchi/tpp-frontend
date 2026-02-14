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

export const CUSTOMERS_ENDPOINTS = {
  CUSTOMERS: '/customers',
  CUSTOMER: '/customer',
  CUSTOMER_BY_ID: (id: number) => `/customer/${id}`,
  ACTIVATE_CUSTOMER_BY_ID: (id: number) => `/customer/${id}/activate`,
} as const
