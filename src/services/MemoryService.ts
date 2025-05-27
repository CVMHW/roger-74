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
