import { persistentAtom } from "@nanostores/persistent";
import { logger } from "@nanostores/logger";

import { InferenceClient } from '@huggingface/inference';

import { settingsStore } from "@stores/settings";


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
  messagesStore.set({});
}

export function addMessage(content: string): void {
    const store = structuredClone(messagesStore.get());
    const message: Message = {
        role: "user",
        content: content
    }

    Object.values(store).forEach(conversation => {
        conversation.push(message);
    });

    messagesStore.set(store);
    inferenceResponse()
}

async function inferenceResponse(): Promise<void> {
    const client = new InferenceClient(settingsStore.get().accessToken);
    const store = structuredClone(messagesStore.get());

    for (const model in store) {
        let conversation = store[model]

        const chatCompletion = await client.chatCompletion({
            model: model,
            messages: conversation as any
        });

        conversation.push(chatCompletion.choices[0].message as Message);
    }
    messagesStore.set(store);
}

export function setDefaultMessages(): void {
  messagesStore.set({
    "openai/gpt-oss-20b": [],
    "deepseek-ai/DeepSeek-V3.2": [],
  });
}
setDefaultMessages()
