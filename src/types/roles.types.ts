export interface Role {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

export interface RolesState {
  roles: Role[]
}

export interface RolesResponse {
  roles: Role[]
}
