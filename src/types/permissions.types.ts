export interface PermissionsState {
  permissions: Permission[]
}

export interface Permission {
  id: number
  name: string
  publicName: string
  description: string
}

export interface PermissionsResponse {
  permissions: Permission[]
  total: number
}
