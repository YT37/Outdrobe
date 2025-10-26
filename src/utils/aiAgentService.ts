interface AIAgentResponse {
  response?: string;
  error?: string;
}

export class AIAgentService {
  private kibanaUrl: string;

  constructor() {
    // Always use relative paths in development for Vite proxy
    // Only use Firebase URL in production or when explicitly testing remote
    const firebaseUrl = import.meta.env.VITE_FIREBASE_FUNCTION_URL;
    const isDev = import.meta.env.VITE_DEV == true;

    this.kibanaUrl = isDev ? `${firebaseUrl}/converse` : "/api/converse";

    console.log("🤖 AI Agent Service initialized:", {
      isDev,
      firebaseUrl,
      kibanaUrl: this.kibanaUrl,
    });
  }

  private isConfigured(): boolean {
    return true; // Firebase functions handle all authentication
  }

  async sendMessage(input: string): Promise<AIAgentResponse> {
    if (!this.isConfigured()) {
      return {
        error: "AI Agent service not available.",
      };
    }

    try {
      const requestBody = {
        agent_id: "outdrobe",
        input: input,
      };

      console.log("🚀 Sending message to:", this.kibanaUrl, requestBody);

      const response = await fetch(this.kibanaUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();

        // Check if we got HTML instead of JSON (Firebase function issue)
        if (errorText.includes("<!DOCTYPE")) {
          throw new Error(
            `Firebase function error: Got HTML page instead of API response. Check if the proxy function is deployed correctly.`
          );
        }

        throw new Error(
          `Kibana API error: ${response.status} ${response.statusText}`
        );
      }

      // Try to parse JSON with better error handling
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        const responseText = await response.text();
        const errorMessage =
          jsonError instanceof Error
            ? jsonError.message
            : "Unknown JSON parsing error";

        // Check if we got HTML instead of JSON
        if (responseText.includes("<!DOCTYPE")) {
          throw new Error(
            `Firebase function returned HTML instead of JSON. Check if the proxy function is deployed correctly.`
          );
        }

        throw new Error(`Invalid JSON response: ${errorMessage}`);
      }

      // Extract the response text from Kibana's response format
      // Note: Adjust this based on the actual response structure from your Kibana instance
      let responseText =
        data.response || data.message || data.content || "No response received";

      // Ensure responseText is always a string, not an object
      if (typeof responseText === "object") {
        responseText =
          responseText.message ||
          responseText.content ||
          responseText.text ||
          JSON.stringify(responseText);
      }

      // Final safety check to ensure it's a string
      responseText = String(responseText);

      const result = {
        response: responseText,
      };
      return result;
    } catch (error) {
      const errorResult = {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
      return errorResult;
    }
  }

  // Fallback response generator for when Kibana API is not available
  generateFallbackResponse(userInput: string): string {
    const lowerInput = userInput.toLowerCase();

    // Fashion and outfit related responses
    if (
      lowerInput.includes("date") ||
      lowerInput.includes("dinner") ||
      lowerInput.includes("romantic")
    ) {
      return "For a romantic date, I'd suggest something elegant yet comfortable. A nice dress or a smart casual outfit with good shoes would work well. What's the occasion and venue like?";
    }

    if (
      lowerInput.includes("work") ||
      lowerInput.includes("office") ||
      lowerInput.includes("business") ||
      lowerInput.includes("meeting")
    ) {
      return "For professional settings, I recommend business casual or formal attire. A well-fitted blazer, dress pants or a pencil skirt, and professional shoes are always safe choices. What's your workplace dress code like?";
    }

    if (
      lowerInput.includes("casual") ||
      lowerInput.includes("weekend") ||
      lowerInput.includes("relaxed")
    ) {
      return "For casual occasions, comfort is key! Jeans with a nice top, sneakers or casual shoes, and maybe a light jacket or cardigan work great. What activities do you have planned?";
    }

    if (
      lowerInput.includes("party") ||
      lowerInput.includes("event") ||
      lowerInput.includes("celebration")
    ) {
      return "Party time! 🎉 I'd suggest something that makes you feel confident and comfortable for dancing or socializing. What type of party is it and what's the expected dress code?";
    }

    if (
      lowerInput.includes("color") ||
      lowerInput.includes("match") ||
      lowerInput.includes("styling")
    ) {
      return "Great question about styling! I love helping with color coordination and outfit matching. Tell me what pieces you're working with and I can suggest combinations that work well together.";
    }

    // Default response
    return "I'd love to help you put together the perfect outfit! 👗✨ Could you tell me more about the occasion? For example, is it for work, a date, casual day out, or a special event? The more details you share, the better I can style you!";
  }
}

export const createAIAgentService = () => {
  return new AIAgentService();
};
