import type {
  CatalogItem,
  ClinicalVariable,
  Evaluation,
  EvaluationPayload,
  PersistedInferenceResult,
  ProcessEvaluationResponse,
} from "../types/evaluation";
import { api } from "./api";

export const evaluationService = {
  async create(payload: EvaluationPayload) {
    const { data } = await api.post<Evaluation>("/api/v1/evaluations", payload);
    return data;
  },

  async getById(evaluationId: number) {
    const { data } = await api.get<Evaluation>(`/api/v1/evaluations/${evaluationId}`);
    return data;
  },

  async list() {
    const { data } = await api.get<Evaluation[]>("/api/v1/evaluations");
    return data;
  },

  async listByPatient(patientId: number) {
    const { data } = await api.get<Evaluation[]>(`/api/v1/patients/${patientId}/evaluations`);
    return data;
  },

  async process(evaluationId: number) {
    const { data } = await api.post<ProcessEvaluationResponse>(`/api/v1/evaluaciones/${evaluationId}/procesar`);
    return data;
  },

  async listResults(evaluationId: number) {
    const { data } = await api.get<PersistedInferenceResult[]>(`/api/v1/evaluations/${evaluationId}/results`);
    return data;
  },

  async listSymptoms() {
    const { data } = await api.get<CatalogItem[]>("/api/v1/symptoms");
    return data;
  },

  async listClinicalVariables() {
    const { data } = await api.get<ClinicalVariable[]>("/api/v1/clinical-variables");
    return data;
  },
};
