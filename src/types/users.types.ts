export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  id: string;
  name: string;
  lastname: string;
  email: string;
  permissions: string[];
  accessToken: string;
}

export interface User {
  name: string
  lastname: string
  email: string
  permissions: string[]
}
