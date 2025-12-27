export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: number;
}

export interface ModelConversation {
  messages: Message[];
  status: 'idle' | 'loading' | 'error' | 'streaming';
  error?: string;
}

export interface Model {
  name: string;
  url: string;
  size: number;
  description?: string;
}

export interface Persona {
  name: string;
  icon: string;
  instruction: string;
  description?: string;
}

export interface Selection {
  models: string[];
  persona: string;
}

export interface Settings {
  accessToken: string;
}

export type ConversationStore = Record<string, ModelConversation>;