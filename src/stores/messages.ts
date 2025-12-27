import { atom, computed } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import { logger } from "@nanostores/logger";

import type { Message, ConversationStore, ModelConversation } from "types";

import { getInferenceService } from "@services/inference";

import { settingsStore } from "@stores/settings";
import { selectionStore } from "@stores/selection";

import { PERSONAS } from "@assets/personas";

export const conversationsStore = persistentAtom<ConversationStore>(
  "conversations:",
  {},
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

export const isGeneratingStore = atom<boolean>(false);

export const hasActiveConversationsStore = computed(
  conversationsStore,
  (convs) => Object.keys(convs).length > 0
);

export const anyModelLoadingStore = computed(
  conversationsStore,
  (convs) => Object.values(convs).some((conv: ModelConversation) => conv.status === 'loading')
);

logger({
  conversations: conversationsStore,
});

export function initializeConversations(): void {
  const selectedModels = selectionStore.get().models;
  const currentConvs = conversationsStore.get();
  const newConvs: ConversationStore = {};

  selectedModels.forEach(modelUrl => {

    newConvs[modelUrl] = currentConvs[modelUrl] || {
      messages: [],
      status: 'idle'
    };
  });

  conversationsStore.set(newConvs);
}

selectionStore.subscribe(selection => {
  const currentConvs = conversationsStore.get();
  const newConvs: ConversationStore = {};

  selection.models.forEach(modelUrl => {
    newConvs[modelUrl] = currentConvs[modelUrl] || {
      messages: [],
      status: 'idle'
    };
  });

  conversationsStore.set(newConvs);
});

export function clearMessages(): void {
  const selectedModels = selectionStore.get().models;
  const newConvs: ConversationStore = {};

  selectedModels.forEach(modelUrl => {
    newConvs[modelUrl] = {
      messages: [],
      status: 'idle'
    };
  });

  conversationsStore.set(newConvs);
}

export async function sendMessage(content: string): Promise<void> {
  if (!content.trim() || isGeneratingStore.get()) return;

  const userMessage: Message = {
    role: "user",
    content: content.trim(),
    timestamp: Date.now()
  };

  const convs = { ...conversationsStore.get() };
  Object.keys(convs).forEach(modelUrl => {
    convs[modelUrl] = {
      ...convs[modelUrl],
      messages: [...convs[modelUrl].messages, userMessage],
      status: 'loading'
    };
  });

  conversationsStore.set(convs);
  isGeneratingStore.set(true);

  await generateResponses();
  
  isGeneratingStore.set(false);
}

async function generateResponses(): Promise<void> {
  const settings = settingsStore.get();
  const selection = selectionStore.get();
  const convs = conversationsStore.get();

  if (!settings.accessToken) {
    updateAllModelsStatus('error', 'Please set your Hugging Face API key');
    return;
  }

  const service = getInferenceService(settings.accessToken);
  const persona = PERSONAS.find(p => p.name === selection.persona);
  const systemInstruction = persona?.instruction || "";

  const inferencePromises = Object.entries(convs).map(async ([modelUrl, conv]) => {
    try {
      const response = await service.generateResponse(
        modelUrl,
        conv.messages,
        systemInstruction
      );

      // Update this model's conversation
      updateModelConversation(modelUrl, {
        messages: [...conv.messages, response],
        status: 'idle'
      });
    } catch (error: any) {
      console.error(`Error with model ${modelUrl}:`, error);
      
      const errorMessage: Message = {
        role: "assistant",
        content: `⚠️ ${error.message}`,
        timestamp: Date.now()
      };

      updateModelConversation(modelUrl, {
        messages: [...conv.messages, errorMessage],
        status: 'error',
        error: error.message
      });
    }
  });

  await Promise.allSettled(inferencePromises);
}

function updateModelConversation(
  modelUrl: string,
  updates: Partial<ConversationStore[string]>
): void {
  const convs = conversationsStore.get();
  conversationsStore.set({
    ...convs,
    [modelUrl]: {
      ...convs[modelUrl],
      ...updates
    }
  });
}

function updateAllModelsStatus(status: ConversationStore[string]['status'], error?: string): void {
  const convs = conversationsStore.get();
  const updated: ConversationStore = {};

  Object.entries(convs).forEach(([modelUrl, conv]) => {
    updated[modelUrl] = {
      ...conv,
      status,
      error
    };
  });

  conversationsStore.set(updated);
}

export function stopGeneration(): void {
  const service = getInferenceService(settingsStore.get().accessToken);
  service.cancelAllRequests();
  updateAllModelsStatus('idle');
  isGeneratingStore.set(false);
}

export function exportConversation(): string {
  return JSON.stringify(conversationsStore.get(), null, 2);
}

initializeConversations();