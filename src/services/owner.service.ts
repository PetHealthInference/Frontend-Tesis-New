import type { Owner, OwnerPayload } from "../types/owner";
import { api } from "./api";

export const ownerService = {
  async list() {
    const { data } = await api.get<Owner[]>("/api/v1/owners/");
    return data;
  },

  async getById(ownerId: number) {
    const { data } = await api.get<Owner>(`/api/v1/owners/${ownerId}`);
    return data;
  },

  async create(payload: OwnerPayload) {
    const { data } = await api.post<Owner>("/api/v1/owners/", payload);
    return data;
  },

  async update(ownerId: number, payload: OwnerPayload) {
    const { data } = await api.put<Owner>(`/api/v1/owners/${ownerId}`, payload);
    return data;
  },

  async remove(ownerId: number) {
    await api.delete(`/api/v1/owners/${ownerId}`);
  },
};
