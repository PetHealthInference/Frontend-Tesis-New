export type RoleName = "admin" | "veterinario" | "evaluador";

export type Role = {
  id: number;
  name: RoleName | string;
  description?: string | null;
};

export type User = {
  id: number;
  full_name: string;
  email: string;
  is_active: boolean;
  role?: Role | null;
};

export type UserCreatePayload = {
  full_name: string;
  email: string;
  password: string;
  role_id: number;
};

export type UserUpdatePayload = {
  full_name?: string;
  email?: string;
  password?: string;
  role_id?: number;
  is_active?: boolean;
};

export type UserFormValues = {
  full_name: string;
  email: string;
  password: string;
  role_id: string;
};
