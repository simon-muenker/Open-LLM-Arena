import { persistentAtom } from "@nanostores/persistent";
import { logger } from "@nanostores/logger";

import type { Selection } from "types";

export const selectionStore = persistentAtom<Selection>(
  "selections:",
  {
    models: [],
    persona: "Base"
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

logger({
  selectionsStore: selectionStore,
});

export function toggleModel(modelUrl: string): void {
  const current = selectionStore.get();
  const models = current.models.includes(modelUrl)
    ? current.models.filter(m => m !== modelUrl)
    : [...current.models, modelUrl];
  
  selectionStore.set({ ...current, models });
}

export function setPersona(personaName: string): void {
  const current = selectionStore.get();
  selectionStore.set({ ...current, persona: personaName });
}

export function isModelSelected(modelUrl: string): boolean {
  return selectionStore.get().models.includes(modelUrl);
}

export function getSelectedPersona(): string {
  return selectionStore.get().persona;
}