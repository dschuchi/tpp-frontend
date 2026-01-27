export interface PermissionsState {
  permissions: Permission[]
}

export interface Permission {
  id: number
  name: string
  description: string
}

export interface PermissionsResponse {
  permissions: Permission[]
}
