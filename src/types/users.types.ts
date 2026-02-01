export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  id: string;
  name: string;
  lastname: string;
  email: string;
  rol_id: number
  rol_name: string
  permissions: string[];
  accessToken: string;
}

export interface User {
  name: string
  lastname: string
  email: string
  rol_name: string
  permissions: string[]
}

export interface UsersResponse {
  users: UserListItem[]
}

export type UsersState = UsersResponse

export interface UserListItem {
  id: string,
  username: string,
  lastname: string,
  email: string,
  rol_name: string,
  is_active: boolean
}
