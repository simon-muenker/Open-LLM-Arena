import { InferenceClient } from '@huggingface/inference';
import type { Message } from 'types';

export class InferenceService {
  private client: InferenceClient;
  private abortControllers: Map<string, AbortController>;

  constructor(accessToken: string) {
    this.client = new InferenceClient(accessToken);
    this.abortControllers = new Map();
  }

  updateToken(accessToken: string): void {
    this.client = new InferenceClient(accessToken);
  }

  async generateResponse(
    modelUrl: string,
    messages: Message[],
    systemInstruction?: string
  ): Promise<Message> {
    const abortController = new AbortController();
    this.abortControllers.set(modelUrl, abortController);

    try {
      const messagesToSend = systemInstruction
        ? [{ role: "system" as const, content: systemInstruction }, ...messages]
        : messages;

      const chatCompletion = await this.client.chatCompletion({
        model: modelUrl,
        messages: messagesToSend as any,
        max_tokens: 1024,
      });

      const response = chatCompletion.choices[0].message;
      
      return {
        role: response.role as "assistant",
        content: response.content || "No response generated",
        timestamp: Date.now()
      };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request cancelled');
      }
      
      if (error.message?.includes('401')) {
        throw new Error('Invalid API key. Please check your Hugging Face token.');
      } else if (error.message?.includes('404')) {
        throw new Error('Model not found or not accessible.');
      } else if (error.message?.includes('429')) {
        throw new Error('Rate limit exceeded. Please wait a moment.');
      } else {
        throw new Error(error.message || 'Failed to generate response');
      }
    } finally {
      this.abortControllers.delete(modelUrl);
    }
  }

  cancelRequest(modelUrl: string): void {
    const controller = this.abortControllers.get(modelUrl);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(modelUrl);
    }
  }

  cancelAllRequests(): void {
    this.abortControllers.forEach(controller => controller.abort());
    this.abortControllers.clear();
  }
}

let inferenceService: InferenceService | null = null;

export function getInferenceService(accessToken: string): InferenceService {
  if (!inferenceService || !accessToken) {
    inferenceService = new InferenceService(accessToken);
  }
  return inferenceService;
}

export function updateInferenceToken(accessToken: string): void {
  if (inferenceService) {
    inferenceService.updateToken(accessToken);
  } else {
    inferenceService = new InferenceService(accessToken);
  }
}