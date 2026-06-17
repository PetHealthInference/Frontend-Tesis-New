import type { User, UserCreatePayload } from "../types/user";
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
};
