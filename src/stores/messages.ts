import { persistentAtom } from "@nanostores/persistent";
import { logger } from "@nanostores/logger";

import { InferenceClient } from '@huggingface/inference';

import { settingsStore } from "@stores/settings";
import { selectionStore } from "@stores/selection";
import { PERSONAS } from "@assets/personas";


interface Message {
  role: "user" | "assistant";
  content: string;
}

// Store Management
export const messagesStore = persistentAtom<Record<string, Array<Message>>>(
  "messages:",
  {},
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

// Logger
logger({
  feedStore: messagesStore,
});

// Modifiers
export function clearMessages(): void {
  initializeConversations();
}

export function initializeConversations(): void {
  const selectedModels = selectionStore.get().models;
  const newStore: Record<string, Array<Message>> = {};
  
  selectedModels.forEach(model => {
    newStore[model] = [];
  });
  
  messagesStore.set(newStore);
}

export function addMessage(content: string): void {
  const store = structuredClone(messagesStore.get());
  const selectedModels = selectionStore.get().models;
  
  // Initialize conversations for newly selected models
  selectedModels.forEach(model => {
    if (!store[model]) {
      store[model] = [];
    }
  });
  
  // Remove conversations for deselected models
  Object.keys(store).forEach(model => {
    if (!selectedModels.includes(model)) {
      delete store[model];
    }
  });
  
  const message: Message = {
    role: "user",
    content: content
  };

  Object.values(store).forEach(conversation => {
    conversation.push(message);
  });

  messagesStore.set(store);
  inferenceResponse();
}

async function inferenceResponse(): Promise<void> {
  const client = new InferenceClient(settingsStore.get().accessToken);
  const store = structuredClone(messagesStore.get());
  const selectedPersona = selectionStore.get().persona;
  
  // Find the persona instruction
  const persona = PERSONAS.find(p => p.name === selectedPersona);
  const systemInstruction = persona?.instruction || "";

  for (const model in store) {
    let conversation = store[model];
    
    // Prepare messages with system instruction if persona is set
    let messagesToSend: any[] = conversation;
    if (systemInstruction) {
      messagesToSend = [
        { role: "system", content: systemInstruction },
        ...conversation
      ];
    }

    try {
      const chatCompletion = await client.chatCompletion({
        model: model,
        messages: messagesToSend
      });

      conversation.push(chatCompletion.choices[0].message as Message);
    } catch (error) {
      console.error(`Error with model ${model}:`, error);
      conversation.push({
        role: "assistant",
        content: `Error: Unable to generate response. Please check your API key and model availability.`
      });
    }
  }
  messagesStore.set(store);
}

// Initialize on load
initializeConversations();