import type { CatalogItem, ClinicalVariable } from "./evaluation";

export type Disease = {
  id: number;
  name: string;
  species_id: number;
  description?: string | null;
  is_degenerative: boolean;
  is_active: boolean;
};

export type RuleCondition = {
  id: number;
  variable_key: string;
  operator: string;
  expected_value: string | number | boolean;
  logical_group?: number;
};

export type RuleConditionPayload = {
  variable_key: string;
  operator: string;
  expected_value: string | number | boolean;
  logical_group: number;
};

export type RulePayload = {
  code: string;
  name: string;
  disease_id: number;
  risk_level_id: number;
  risk_level?: string;
  weight: number;
  priority: number;
  version: number;
  is_active: boolean;
  conditions: RuleConditionPayload[];
};

export type RuleStatusPayload = {
  is_active: boolean;
};

export type Rule = {
  id: number;
  code: string;
  name: string;
  disease_id: number;
  risk_level_id: number;
  risk_level: string;
  weight: number;
  priority: number;
  version: number;
  is_active: boolean;
  conditions: RuleCondition[];
};

export type RiskLevel = {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  min_probability?: number | null;
  max_probability?: number | null;
  sort_order: number;
  is_active: boolean;
};

export type KnowledgeBaseData = {
  diseases: Disease[];
  symptoms: CatalogItem[];
  clinicalVariables: ClinicalVariable[];
  rules: Rule[];
  riskLevels: RiskLevel[];
};

export type KnowledgeTab = "diseases" | "symptoms" | "variables" | "rules" | "risk";
