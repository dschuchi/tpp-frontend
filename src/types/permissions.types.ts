export interface PermissionsState {
  permissions: Permission[]
}

export interface Permission {
  id: string
  name: string
  description: string
}

export interface PermissionsResponse {
  permissions: Permission[]
}
