import { persistentAtom } from "@nanostores/persistent";
import { logger } from "@nanostores/logger";

interface Selections {
  models: string[];
  persona: string;
}

// Store Management
export const selectionStore = persistentAtom<Selections>(
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

// Logger
logger({
  selectionsStore: selectionStore,
});

// Modifiers
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