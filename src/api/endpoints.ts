export const USERS_ENDPOINTS = {
  LOGIN: '/user/login',
  ME: '/user/me'
} as const

export const ROLES_ENDPOINTS = {
  ROLES: '/roles',
  ROLE: '/role',
  ROLE_BY_ID: (id: number) => `/role/${id}`,
  ACTIVATE_ROLE_BY_ID: (id: number) => `/role/${id}/activate`
} as const
