export interface Role {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

export interface RolesState {
  roles: Role[],
  permissions: Permission[]
}

export interface RolesResponse {
  roles: Role[]
}

export interface CreateRoleRequest {
  name: string,
  description: string
}

export interface RolePermissionsResponse {
  permissions: Permission[]
}

export interface Permission {
  id: string
  name: string
}
