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
  refreshToken: string;
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

export interface UsersState {
  users: UserListItem[]
}

export interface UserListItem {
  id: string,
  username: string,
  lastname: string,
  email: string,
  rol_id: string
  rol_name: string,
  is_active: boolean
}

export interface CreateUserRequest {
  username: string
  lastname: string
  email: string
}

export interface CreateUserResponse {
  email: string
  password: string
}

export interface UpdateUserRequest {
  username: string
  lastname: string
  email: string
  password?: string
  rol_id: number
}

export interface UpdatePasswordRequest {
  password: string
}
