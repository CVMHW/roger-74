
/**
 * Memory Service
 * 
 * Manages conversation memory and context for therapeutic sessions
 */

export interface MemoryItem {
  id: string;
  content: string;
  timestamp: number;
  importance: number;
  type: string;
}

export interface MemoryContext {
  relevantItems: MemoryItem[];
  currentFocus: string;
  conversationPhase: string;
}

export class MemoryService {
  private memoryStore: Map<string, MemoryItem[]> = new Map();

  /**
   * Store a memory item
   */
  async store(sessionId: string, item: MemoryItem): Promise<void> {
    if (!this.memoryStore.has(sessionId)) {
      this.memoryStore.set(sessionId, []);
    }
    
    const memories = this.memoryStore.get(sessionId)!;
    memories.push(item);
    
    // Keep only last 50 items for performance
    if (memories.length > 50) {
      memories.splice(0, memories.length - 50);
    }
  }

  /**
   * Retrieve relevant memories
   */
  async retrieve(sessionId: string, query: string): Promise<MemoryContext> {
    const memories = this.memoryStore.get(sessionId) || [];
    
    // Simple relevance filtering based on keyword matching
    const relevantItems = memories.filter(item => 
      item.content.toLowerCase().includes(query.toLowerCase())
    ).slice(-5); // Last 5 relevant items
    
    return {
      relevantItems,
      currentFocus: this.extractFocus(query),
      conversationPhase: memories.length < 3 ? 'opening' : 'developing'
    };
  }

  /**
   * Retrieve relevant context with emotion analysis
   */
  async retrieveRelevantContext(
    userInput: string,
    conversationHistory: string[],
    emotionAnalysis: any
  ): Promise<MemoryContext> {
    const sessionId = 'current'; // Use a default session for now
    
    // Store current input
    await this.store(sessionId, {
      id: `memory_${Date.now()}`,
      content: userInput,
      timestamp: Date.now(),
      importance: emotionAnalysis?.intensity || 0.5,
      type: 'user_input'
    });
    
    return this.retrieve(sessionId, userInput);
  }

  /**
   * Update memory with interaction
   */
  async updateWithInteraction(
    userInput: string,
    response: string,
    emotionAnalysis: any,
    confidence: number
  ): Promise<void> {
    const sessionId = 'current';
    
    // Store the response
    await this.store(sessionId, {
      id: `response_${Date.now()}`,
      content: response,
      timestamp: Date.now(),
      importance: confidence,
      type: 'assistant_response'
    });
  }

  /**
   * Record crisis situation
   */
  async recordCrisis(
    userInput: string,
    crisisResponse: string,
    crisisResult: any
  ): Promise<void> {
    const sessionId = 'current';
    
    // Store crisis event with high importance
    await this.store(sessionId, {
      id: `crisis_${Date.now()}`,
      content: `CRISIS: ${userInput} | RESPONSE: ${crisisResponse}`,
      timestamp: Date.now(),
      importance: 1.0,
      type: 'crisis_event'
    });
  }

  private extractFocus(query: string): string {
    // Simple focus extraction
    const topics = {
      'emotional': /\b(feel|emotion|sad|happy|angry|anxious)\b/i,
      'relationships': /\b(relationship|family|friend|partner)\b/i,
      'work': /\b(work|job|career|stress)\b/i
    };

    for (const [topic, pattern] of Object.entries(topics)) {
      if (pattern.test(query)) return topic;
    }

    return 'general';
  }

  /**
   * Health check for memory service
   */
  async isHealthy(): Promise<boolean> {
    return true;
  }
}
