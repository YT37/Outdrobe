import { createAIAgentService } from "./aiAgentService";

export interface Message {
  id: string;
  type: "user" | "agent";
  content: string;
  timestamp: Date;
  outfitSuggestion?: OutfitSuggestion;
  dealSuggestion?: DealSuggestion;
  agentAction?: string;
}

export interface OutfitSuggestion {
  items: string[];
  reasoning: string;
  colorScore: number;
  style: string;
}

export interface DealSuggestion {
  item: string;
  price: string;
  store: string;
  link: string;
  imageUrl?: string;
}

export interface ChatServiceCallbacks {
  onMessageAdd: (message: Message) => void;
  onProcessingChange: (isProcessing: boolean) => void;
  onSpeechTrigger: (text: string) => void;
}

export class ChatService {
  private aiAgentService;
  private callbacks: ChatServiceCallbacks;

  constructor(callbacks: ChatServiceCallbacks) {
    this.callbacks = callbacks;
    this.aiAgentService = createAIAgentService();
  }

  async handleUserMessage(content: string): Promise<void> {
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    // Add user message to chat
    this.callbacks.onMessageAdd(userMessage);
    this.callbacks.onProcessingChange(true);

    // Generate AI response
    await this.generateAIResponse(content);
  }

  private async generateAIResponse(userInput: string): Promise<void> {
    try {
      // Call AI agent service
      const aiResponse = await this.aiAgentService.sendMessage(userInput);

      let responseContent: string;

      if (aiResponse.error) {
        // Use fallback response if API fails
        responseContent =
          this.aiAgentService.generateFallbackResponse(userInput);
      } else {
        responseContent =
          aiResponse.response ||
          this.aiAgentService.generateFallbackResponse(userInput);

        // Ensure responseContent is always a string
        if (typeof responseContent === "object" && responseContent !== null) {
          const obj = responseContent as any;
          responseContent =
            obj.message ||
            obj.content ||
            obj.text ||
            JSON.stringify(responseContent);
        }
        responseContent = String(responseContent);
      }

      const agentMessage: Message = {
        id: Date.now().toString(),
        type: "agent",
        content: responseContent,
        timestamp: new Date(),
        agentAction: "ai_response",
      };

      // Add agent message to chat
      this.callbacks.onMessageAdd(agentMessage);
      this.callbacks.onProcessingChange(false);

      // Trigger speech synthesis with delay
      setTimeout(() => {
        this.callbacks.onSpeechTrigger(responseContent);
      }, 100);
    } catch (error) {
      // Emergency fallback
      const fallbackContent =
        this.aiAgentService.generateFallbackResponse(userInput);

      const agentMessage: Message = {
        id: Date.now().toString(),
        type: "agent",
        content: fallbackContent,
        timestamp: new Date(),
        agentAction: "fallback_response",
      };

      this.callbacks.onMessageAdd(agentMessage);
      this.callbacks.onProcessingChange(false);

      setTimeout(() => {
        this.callbacks.onSpeechTrigger(fallbackContent);
      }, 100);
    }
  }
}

export const createChatService = (callbacks: ChatServiceCallbacks) => {
  return new ChatService(callbacks);
};
