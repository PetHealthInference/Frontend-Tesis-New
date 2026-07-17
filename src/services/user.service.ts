import type { User, UserCreatePayload, UserUpdatePayload } from "../types/user";
import { api } from "./api";

export const userService = {
  async list() {
    const { data } = await api.get<User[]>("/api/v1/users");
    return data;
  },

  async create(payload: UserCreatePayload) {
    const { data } = await api.post<User>("/api/v1/users", payload);
    return data;
  },

  async update(userId: number, payload: UserUpdatePayload) {
    const { data } = await api.put<User>(`/api/v1/users/${userId}`, payload);
    return data;
  },

  async updateStatus(userId: number, isActive: boolean) {
    const { data } = await api.patch<User>(`/api/v1/users/${userId}/status`, { is_active: isActive });
    return data;
  },
};
