export interface Role {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  permissions: Permission[]
}

export interface RolesState {
  roles: Role[],
  permissions: Permission[],
  role?: Role
}

export interface RolesResponse {
  roles: Role[]
}

export interface CreateRoleRequest {
  name: string,
  description: string
}

export interface Permission {
  id: string
  name: string
}

export type UpdateRoleRequest = CreateRoleRequest
