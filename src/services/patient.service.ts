import type { Breed, Patient, PatientPayload, Species } from "../types/patient";
import { api } from "./api";

export const patientService = {
  async list() {
    const { data } = await api.get<Patient[]>("/api/v1/patients");
    return data;
  },

  async getById(patientId: number) {
    const { data } = await api.get<Patient>(`/api/v1/patients/${patientId}`);
    return data;
  },

  async create(payload: PatientPayload) {
    const { data } = await api.post<Patient>("/api/v1/patients", payload);
    return data;
  },

  async update(patientId: number, payload: PatientPayload) {
    const { data } = await api.put<Patient>(`/api/v1/patients/${patientId}`, payload);
    return data;
  },

  async listSpecies() {
    const { data } = await api.get<Species[]>("/api/v1/species");
    return data;
  },

  async listBreeds(speciesId?: number) {
    const pageSize = 100;
    const breeds: Breed[] = [];

    for (let skip = 0; ; skip += pageSize) {
      const { data } = await api.get<Breed[]>("/api/v1/breeds", {
        params: { ...(speciesId ? { species_id: speciesId } : {}), limit: pageSize, skip },
      });
      breeds.push(...data);

      if (data.length < pageSize) {
        return breeds;
      }
    }
  },

  async remove(patientId: number): Promise<void> {
    await api.delete(`/api/v1/patients/${patientId}`);
  },
};

