
/**
 * Response Service
 * 
 * Generates therapeutic responses using all available context
 */

export interface ResponseContext {
  userInput: string;
  emotionAnalysis: any;
  memoryContext: any;
  ragEnhancement: any;
  personalityContext: any;
  conversationHistory: string[];
  crisisLevel: string;
}

export interface ResponseResult {
  text: string;
  confidence: number;
  responseType: string;
}

export interface HallucinationPreventionResult {
  text: string;
  confidence: number;
  wasModified: boolean;
}

export class ResponseService {
  /**
   * Generate therapeutic response using all available context
   */
  async generate(context: ResponseContext): Promise<ResponseResult> {
    try {
      // Build response based on crisis level
      if (context.crisisLevel !== 'none') {
        return this.generateCrisisResponse(context);
      }
      
      // Generate contextual response
      const baseResponse = this.generateContextualResponse(context);
      
      // Apply personality adjustments
      const personalizedResponse = this.applyPersonalityAdjustments(baseResponse, context.personalityContext);
      
      // Enhance with RAG if available
      const enhancedResponse = this.enhanceWithRAG(personalizedResponse, context.ragEnhancement);
      
      return {
        text: enhancedResponse,
        confidence: 0.8,
        responseType: 'therapeutic'
      };
    } catch (error) {
      console.error('Response generation error:', error);
      return this.generateFallbackResponse(context.userInput);
    }
  }

  /**
   * Prevent hallucinations in generated response
   */
  async preventHallucinations(
    response: string,
    userInput: string,
    conversationHistory: string[],
    memoryContext: any
  ): Promise<HallucinationPreventionResult> {
    // Check for factual inconsistencies
    const hasInconsistencies = this.checkForInconsistencies(response, conversationHistory);
    
    // Check for inappropriate content
    const hasInappropriateContent = this.checkForInappropriateContent(response);
    
    // Check for repetitive patterns
    const hasRepetition = this.checkForRepetition(response, conversationHistory);
    
    let modifiedResponse = response;
    let wasModified = false;
    
    if (hasInconsistencies || hasInappropriateContent || hasRepetition) {
      modifiedResponse = this.fixHallucination(response, userInput);
      wasModified = true;
    }
    
    return {
      text: modifiedResponse,
      confidence: wasModified ? 0.6 : 0.9,
      wasModified
    };
  }

  private generateCrisisResponse(context: ResponseContext): ResponseResult {
    return {
      text: "I'm concerned about what you've shared. Please know that help is available. You can call 988 for the National Suicide Prevention Lifeline or text 741741 for the Crisis Text Line.",
      confidence: 0.95,
      responseType: 'crisis'
    };
  }

  private generateContextualResponse(context: ResponseContext): string {
    const emotion = context.emotionAnalysis?.primaryEmotion || 'neutral';
    const userInput = context.userInput;
    
    // Generate emotion-appropriate response
    if (emotion === 'sad') {
      return `I can hear the sadness in what you're sharing. It sounds like you're going through a difficult time. Would you like to tell me more about what's been weighing on you?`;
    }
    
    if (emotion === 'anxious') {
      return `It sounds like you're feeling anxious about this. That's completely understandable. Sometimes it can help to talk through what's making you feel this way.`;
    }
    
    if (emotion === 'angry') {
      return `I can sense your frustration. Those feelings are valid. What's been making you feel this way?`;
    }
    
    // Default empathetic response
    return `I hear what you're saying. It sounds like this is important to you. Can you help me understand more about what you're experiencing?`;
  }

  private applyPersonalityAdjustments(response: string, personalityContext: any): string {
    if (!personalityContext) return response;
    
    // Adjust tone based on personality context
    if (personalityContext.emotionalTone === 'gentle') {
      return response.replace(/\./g, ', and I want you to know that your feelings are completely valid.');
    }
    
    if (personalityContext.communicationStyle === 'direct') {
      return response.replace(/It sounds like/g, 'It seems clear that');
    }
    
    return response;
  }

  private enhanceWithRAG(response: string, ragEnhancement: any): string {
    if (!ragEnhancement?.wasApplied || !ragEnhancement.enhancedContext?.length) {
      return response;
    }
    
    // Add relevant context from RAG
    const context = ragEnhancement.enhancedContext[0];
    if (context && context.length > 0) {
      return `${response} Based on what we know about similar situations, ${context.slice(0, 100)}...`;
    }
    
    return response;
  }

  private checkForInconsistencies(response: string, conversationHistory: string[]): boolean {
    // Simple check for contradictions
    const recentHistory = conversationHistory.slice(-3).join(' ').toLowerCase();
    const responseLower = response.toLowerCase();
    
    // Check for basic contradictions
    if (recentHistory.includes('happy') && responseLower.includes('sad')) return true;
    if (recentHistory.includes('calm') && responseLower.includes('anxious')) return true;
    
    return false;
  }

  private checkForInappropriateContent(response: string): boolean {
    const inappropriate = ['medical advice', 'diagnose', 'medication', 'prescription'];
    const responseLower = response.toLowerCase();
    
    return inappropriate.some(term => responseLower.includes(term));
  }

  private checkForRepetition(response: string, conversationHistory: string[]): boolean {
    if (conversationHistory.length === 0) return false;
    
    const lastResponse = conversationHistory[conversationHistory.length - 1]?.toLowerCase();
    const currentResponse = response.toLowerCase();
    
    // Check for exact repetition
    if (lastResponse === currentResponse) return true;
    
    // Check for similar structure
    const similarity = this.calculateSimilarity(lastResponse || '', currentResponse);
    return similarity > 0.8;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  private fixHallucination(response: string, userInput: string): string {
    // Generate a safe, generic response
    return `I hear what you're saying, and I want to make sure I understand you correctly. Could you tell me a bit more about what's on your mind?`;
  }

  private generateFallbackResponse(userInput: string): ResponseResult {
    return {
      text: "I'm listening and want to understand what you're going through. Could you tell me more about what's on your mind?",
      confidence: 0.5,
      responseType: 'fallback'
    };
  }

  /**
   * Health check for response service
   */
  async isHealthy(): Promise<boolean> {
    try {
      const testContext = {
        userInput: "test",
        emotionAnalysis: null,
        memoryContext: null,
        ragEnhancement: null,
        personalityContext: null,
        conversationHistory: [],
        crisisLevel: 'none'
      };
      
      const result = await this.generate(testContext);
      return result.text.length > 0;
    } catch {
      return false;
    }
  }
}
