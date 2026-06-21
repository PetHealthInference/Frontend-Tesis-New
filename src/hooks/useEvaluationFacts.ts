import { useEffect, useState } from "react";
import { evaluationService } from "../services/evaluation.service";
import type { FactDefinition } from "../types/evaluation";

export function useEvaluationFacts(speciesId?: number) {
  const [data, setData] = useState<FactDefinition[]>([]);
  const [error, setError] = useState("");
  const [loadedSpeciesId, setLoadedSpeciesId] = useState<number>();
  const [failedSpeciesId, setFailedSpeciesId] = useState<number>();

  useEffect(() => {
    if (!speciesId) {
      return;
    }

    let active = true;
    evaluationService
      .getEvaluationFacts(speciesId)
      .then((facts) => {
        if (!active) return;
        setData(facts.filter((fact) => fact.is_active));
        setLoadedSpeciesId(speciesId);
        setFailedSpeciesId(undefined);
        setError("");
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(getErrorMessage(cause));
        setFailedSpeciesId(speciesId);
      })

    return () => {
      active = false;
    };
  }, [speciesId]);

  const isCurrent = speciesId === loadedSpeciesId;
  return {
    data: isCurrent ? data : [],
    error: speciesId === failedSpeciesId ? error : "",
    isLoading: Boolean(speciesId) && !isCurrent && speciesId !== failedSpeciesId,
  };
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const detail = (error as { response?: { data?: { detail?: string } } }).response?.data?.detail;
    if (detail) return detail;
  }
  return "No fue posible cargar los facts clínicos.";
}
