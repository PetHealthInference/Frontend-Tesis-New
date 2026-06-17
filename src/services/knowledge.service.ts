import type { KnowledgeBaseData, Disease, RiskLevel, Rule } from "../types/knowledge";
import { api } from "./api";
import { evaluationService } from "./evaluation.service";

export const knowledgeService = {
  async listDiseases() {
    const { data } = await api.get<Disease[]>("/api/v1/diseases");
    return data;
  },

  async listRules() {
    const { data } = await api.get<Rule[]>("/api/v1/rules");
    return data;
  },

  async listRiskLevels() {
    const { data } = await api.get<RiskLevel[]>("/api/v1/risk-levels");
    return data;
  },

  async getKnowledgeBase(): Promise<KnowledgeBaseData> {
    const [diseases, symptoms, clinicalVariables, rules, riskLevels] = await Promise.all([
      this.listDiseases(),
      evaluationService.listSymptoms(),
      evaluationService.listClinicalVariables(),
      this.listRules(),
      this.listRiskLevels(),
    ]);

    return {
      diseases,
      symptoms,
      clinicalVariables,
      rules,
      riskLevels,
    };
  },
};
