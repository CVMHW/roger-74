/**
 * Unified Memory Service
 * 
 * Integrates all memory systems into a single coherent service:
 * - Short-term memory (session-based)
 * - Working memory (active conversation)
 * - Long-term memory (persistent across sessions)
 * - Patient profile memory (user preferences and patterns)
 * - Crisis memory (special handling for safety concerns)
 */

import { masterMemory } from '../utils/memory';
import { EmotionAnalysis } from './EmotionAnalysisService';

export interface MemoryContext {
  relevantItems: MemoryItem[];
  conversationSummary: string;
  emotionalPattern: string;
  crisisHistory: CrisisMemoryItem[];
  userPreferences: UserPreferences;
}

export interface MemoryItem {
  id: string;
  content: string;
  type: 'user_input' | 'roger_response' | 'emotion' | 'crisis' | 'preference';
  timestamp: number;
  importance: number;
  emotionContext?: string;
  sessionId?: string;
}

export interface CrisisMemoryItem {
  content: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  interventionTaken: string;
  resolved: boolean;
}

export interface UserPreferences {
  communicationStyle?: 'direct' | 'gentle' | 'supportive';
  triggerTopics?: string[];
  preferredApproaches?: string[];
  developmentalStage?: 'child' | 'teen' | 'adult' | 'elder';
}

/**
 * Unified Memory Service
 */
export class MemoryService {
  private readonly shortTermMemory: Map<string, MemoryItem[]> = new Map();
  private readonly workingMemory: MemoryItem[] = [];
  private readonly maxWorkingMemorySize = 20;
  private readonly maxShortTermItems = 100;

  /**
   * Retrieve relevant context for current interaction
   */
  async retrieveRelevantContext(
    userInput: string,
    conversationHistory: string[],
    emotionAnalysis: EmotionAnalysis
  ): Promise<MemoryContext> {
    try {
      // Get relevant memories from all systems
      const relevantMemories = await this.searchAllMemorySystems(userInput, emotionAnalysis);
      
      // Get conversation summary from working memory
      const conversationSummary = this.generateConversationSummary(conversationHistory);
      
      // Identify emotional patterns
      const emotionalPattern = await this.identifyEmotionalPattern(emotionAnalysis, relevantMemories);
      
      // Get crisis history
      const crisisHistory = await this.getCrisisHistory();
      
      // Get user preferences
      const userPreferences = await this.getUserPreferences();
      
      return {
        relevantItems: relevantMemories,
        conversationSummary,
        emotionalPattern,
        crisisHistory,
        userPreferences
      };
    } catch (error) {
      console.error('Error retrieving memory context:', error);
      return this.getEmptyContext();
    }
  }

  /**
   * Search across all memory systems
   */
  private async searchAllMemorySystems(userInput: string, emotionAnalysis: EmotionAnalysis): Promise<MemoryItem[]> {
    const allMemories: MemoryItem[] = [];
    
    // Search master memory system
    const masterResults = masterMemory.searchMemory({
      query: userInput,
      emotion: emotionAnalysis.primaryEmotion,
      limit: 10
    });
    
    allMemories.push(...this.convertMasterMemoryResults(masterResults));
    
    // Search working memory
    const workingResults = this.searchWorkingMemory(userInput, emotionAnalysis);
    allMemories.push(...workingResults);
    
    // Search short-term memory for current session
    const shortTermResults = this.searchShortTermMemory(userInput, emotionAnalysis);
    allMemories.push(...shortTermResults);
    
    // Deduplicate and rank by relevance
    return this.rankAndDeduplicateMemories(allMemories, userInput, emotionAnalysis);
  }

  /**
   * Convert master memory results to unified format
   */
  private convertMasterMemoryResults(results: any[]): MemoryItem[] {
    return results.map(result => ({
      id: result.id || `master_${Date.now()}_${Math.random()}`,
      content: result.content || result.text || '',
      type: result.role === 'patient' ? 'user_input' : 'roger_response',
      timestamp: result.timestamp || Date.now(),
      importance: result.importance || 0.5,
      emotionContext: result.context?.emotions?.[0],
      sessionId: result.sessionId
    }));
  }

  /**
   * Search working memory with emotion awareness
   */
  private searchWorkingMemory(userInput: string, emotionAnalysis: EmotionAnalysis): MemoryItem[] {
    const keywords = userInput.toLowerCase().split(/\s+/);
    const emotionKeywords = [emotionAnalysis.primaryEmotion, ...emotionAnalysis.secondaryEmotions];
    
    return this.workingMemory.filter(item => {
      const content = item.content.toLowerCase();
      const hasKeywordMatch = keywords.some(keyword => content.includes(keyword));
      const hasEmotionMatch = emotionKeywords.some(emotion => 
        content.includes(emotion) || item.emotionContext === emotion
      );
      
      return hasKeywordMatch || hasEmotionMatch;
    }).slice(0, 5);
  }

  /**
   * Search short-term memory for current session
   */
  private searchShortTermMemory(userInput: string, emotionAnalysis: EmotionAnalysis): MemoryItem[] {
    const currentSession = this.getCurrentSessionId();
    const sessionMemories = this.shortTermMemory.get(currentSession) || [];
    
    const keywords = userInput.toLowerCase().split(/\s+/);
    
    return sessionMemories.filter(item => {
      const content = item.content.toLowerCase();
      return keywords.some(keyword => content.includes(keyword));
    }).slice(0, 8);
  }

  /**
   * Rank and deduplicate memories by relevance
   */
  private rankAndDeduplicateMemories(
    memories: MemoryItem[],
    userInput: string,
    emotionAnalysis: EmotionAnalysis
  ): MemoryItem[] {
    // Remove duplicates by content similarity
    const uniqueMemories = this.removeDuplicateMemories(memories);
    
    // Calculate relevance scores
    const scoredMemories = uniqueMemories.map(memory => ({
      ...memory,
      relevanceScore: this.calculateRelevanceScore(memory, userInput, emotionAnalysis)
    }));
    
    // Sort by relevance and return top results
    return scoredMemories
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 15)
      .map(({ relevanceScore, ...memory }) => memory);
  }

  /**
   * Remove duplicate memories based on content similarity
   */
  private removeDuplicateMemories(memories: MemoryItem[]): MemoryItem[] {
    const unique: MemoryItem[] = [];
    const seenContent = new Set<string>();
    
    for (const memory of memories) {
      const contentHash = this.generateContentHash(memory.content);
      if (!seenContent.has(contentHash)) {
        seenContent.add(contentHash);
        unique.push(memory);
      }
    }
    
    return unique;
  }

  /**
   * Generate simple content hash for deduplication
   */
  private generateContentHash(content: string): string {
    return content.toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 50);
  }

  /**
   * Calculate relevance score for memory item
   */
  private calculateRelevanceScore(
    memory: MemoryItem,
    userInput: string,
    emotionAnalysis: EmotionAnalysis
  ): number {
    let score = 0;
    
    // Base importance score
    score += memory.importance * 0.3;
    
    // Recency score (more recent = higher score)
    const ageInHours = (Date.now() - memory.timestamp) / (1000 * 60 * 60);
    score += Math.max(0, 1 - ageInHours / 24) * 0.2;
    
    // Content relevance score
    const contentRelevance = this.calculateContentRelevance(memory.content, userInput);
    score += contentRelevance * 0.3;
    
    // Emotion alignment score
    if (memory.emotionContext === emotionAnalysis.primaryEmotion) {
      score += 0.2;
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * Calculate content relevance between memory and current input
   */
  private calculateContentRelevance(memoryContent: string, userInput: string): number {
    const memoryWords = memoryContent.toLowerCase().split(/\s+/);
    const inputWords = userInput.toLowerCase().split(/\s+/);
    
    const commonWords = memoryWords.filter(word => 
      inputWords.includes(word) && word.length > 2
    );
    
    return commonWords.length / Math.max(inputWords.length, memoryWords.length);
  }

  /**
   * Generate conversation summary from history
   */
  private generateConversationSummary(conversationHistory: string[]): string {
    if (conversationHistory.length === 0) {
      return "Beginning of conversation";
    }
    
    if (conversationHistory.length <= 3) {
      return "Early conversation stage";
    }
    
    // Analyze conversation themes
    const allText = conversationHistory.join(' ').toLowerCase();
    const themes = this.extractConversationThemes(allText);
    
    return `Ongoing conversation about ${themes.join(', ')}`;
  }

  /**
   * Extract main themes from conversation
   */
  private extractConversationThemes(text: string): string[] {
    const themeKeywords = {
      'feelings': ['feel', 'feeling', 'emotion', 'sad', 'happy', 'angry', 'anxious'],
      'relationships': ['family', 'friend', 'partner', 'relationship', 'spouse'],
      'work': ['work', 'job', 'career', 'boss', 'colleague'],
      'health': ['health', 'sick', 'pain', 'medical', 'doctor'],
      'stress': ['stress', 'pressure', 'overwhelm', 'busy', 'tired']
    };
    
    const foundThemes: string[] = [];
    
    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        foundThemes.push(theme);
      }
    }
    
    return foundThemes.length > 0 ? foundThemes : ['general conversation'];
  }

  /**
   * Identify emotional patterns from memory and current analysis
   */
  private async identifyEmotionalPattern(
    currentEmotion: EmotionAnalysis,
    memories: MemoryItem[]
  ): Promise<string> {
    const emotionalMemories = memories.filter(m => m.emotionContext);
    
    if (emotionalMemories.length === 0) {
      return `Currently experiencing ${currentEmotion.primaryEmotion}`;
    }
    
    const emotionCounts = emotionalMemories.reduce((counts, memory) => {
      const emotion = memory.emotionContext!;
      counts[emotion] = (counts[emotion] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    const dominantEmotion = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0];
    
    if (dominantEmotion === currentEmotion.primaryEmotion) {
      return `Consistent pattern of ${dominantEmotion}`;
    }
    
    return `Shift from ${dominantEmotion} to ${currentEmotion.primaryEmotion}`;
  }

  /**
   * Get crisis history for safety assessment
   */
  private async getCrisisHistory(): Promise<CrisisMemoryItem[]> {
    // This would integrate with crisis memory storage
    // For now, return empty array as placeholder
    return [];
  }

  /**
   * Get user preferences for personalized responses
   */
  private async getUserPreferences(): Promise<UserPreferences> {
    // This would integrate with user preference storage
    // For now, return default preferences
    return {
      communicationStyle: 'supportive',
      triggerTopics: [],
      preferredApproaches: ['person-centered'],
      developmentalStage: 'adult'
    };
  }

  /**
   * Update memory with new interaction
   */
  async updateWithInteraction(
    userInput: string,
    rogerResponse: string,
    emotionAnalysis: EmotionAnalysis,
    confidence: number
  ): Promise<void> {
    const timestamp = Date.now();
    const sessionId = this.getCurrentSessionId();
    
    // Update master memory
    masterMemory.addMemory(userInput, 'patient', {
      emotions: [emotionAnalysis.primaryEmotion],
      intensity: emotionAnalysis.intensity
    }, confidence);
    
    masterMemory.addMemory(rogerResponse, 'roger', {
      inResponseTo: userInput,
      confidence
    });
    
    // Update working memory
    this.addToWorkingMemory({
      id: `user_${timestamp}`,
      content: userInput,
      type: 'user_input',
      timestamp,
      importance: this.calculateImportance(userInput, emotionAnalysis),
      emotionContext: emotionAnalysis.primaryEmotion
    });
    
    this.addToWorkingMemory({
      id: `roger_${timestamp}`,
      content: rogerResponse,
      type: 'roger_response',
      timestamp,
      importance: confidence,
      emotionContext: emotionAnalysis.primaryEmotion
    });
    
    // Update short-term memory for session
    this.addToShortTermMemory(sessionId, userInput, rogerResponse, emotionAnalysis);
  }

  /**
   * Record crisis interaction with special handling
   */
  async recordCrisis(
    userInput: string,
    rogerResponse: string,
    crisisInfo: any
  ): Promise<void> {
    // Add to master memory with high importance
    masterMemory.addMemory(userInput, 'patient', {
      crisis: true,
      severity: crisisInfo.level,
      timestamp: Date.now()
    }, 0.95);
    
    masterMemory.addMemory(rogerResponse, 'roger', {
      crisisResponse: true,
      intervention: crisisInfo.interventionType
    }, 0.95);
    
    // Add to working memory with maximum importance
    this.addToWorkingMemory({
      id: `crisis_${Date.now()}`,
      content: `CRISIS: ${userInput}`,
      type: 'crisis',
      timestamp: Date.now(),
      importance: 1.0,
      emotionContext: 'crisis'
    });
  }

  /**
   * Add item to working memory with size management
   */
  private addToWorkingMemory(item: MemoryItem): void {
    this.workingMemory.unshift(item);
    
    // Keep working memory size manageable
    if (this.workingMemory.length > this.maxWorkingMemorySize) {
      this.workingMemory.pop();
    }
  }

  /**
   * Add to short-term memory for current session
   */
  private addToShortTermMemory(
    sessionId: string,
    userInput: string,
    rogerResponse: string,
    emotionAnalysis: EmotionAnalysis
  ): void {
    const sessionMemories = this.shortTermMemory.get(sessionId) || [];
    const timestamp = Date.now();
    
    sessionMemories.push({
      id: `session_user_${timestamp}`,
      content: userInput,
      type: 'user_input',
      timestamp,
      importance: this.calculateImportance(userInput, emotionAnalysis),
      emotionContext: emotionAnalysis.primaryEmotion,
      sessionId
    });
    
    sessionMemories.push({
      id: `session_roger_${timestamp}`,
      content: rogerResponse,
      type: 'roger_response',
      timestamp,
      importance: 0.7,
      emotionContext: emotionAnalysis.primaryEmotion,
      sessionId
    });
    
    // Limit session memory size
    if (sessionMemories.length > this.maxShortTermItems) {
      sessionMemories.splice(0, sessionMemories.length - this.maxShortTermItems);
    }
    
    this.shortTermMemory.set(sessionId, sessionMemories);
  }

  /**
   * Calculate importance score for memory item
   */
  private calculateImportance(content: string, emotionAnalysis: EmotionAnalysis): number {
    let importance = 0.5; // Base importance
    
    // Higher importance for emotional content
    if (emotionAnalysis.intensity > 0.7) {
      importance += 0.3;
    }
    
    // Higher importance for longer, more detailed content
    if (content.length > 100) {
      importance += 0.1;
    }
    
    // Higher importance for crisis-related content
    if (/\b(crisis|emergency|help|suicid|harm|hurt)\b/i.test(content)) {
      importance = 1.0;
    }
    
    return Math.min(importance, 1.0);
  }

  /**
   * Get current session identifier
   */
  private getCurrentSessionId(): string {
    // Simple session ID based on day - in production, use proper session management
    return `session_${new Date().toDateString()}`;
  }

  /**
   * Get empty context for error cases
   */
  private getEmptyContext(): MemoryContext {
    return {
      relevantItems: [],
      conversationSummary: "No conversation history available",
      emotionalPattern: "Unknown emotional state",
      crisisHistory: [],
      userPreferences: {
        communicationStyle: 'supportive',
        triggerTopics: [],
        preferredApproaches: ['person-centered'],
        developmentalStage: 'adult'
      }
    };
  }

  /**
   * Health check for memory service
   */
  async isHealthy(): Promise<boolean> {
    try {
      // Test memory operations
      const testItem: MemoryItem = {
        id: 'health_check',
        content: 'test',
        type: 'user_input',
        timestamp: Date.now(),
        importance: 0.5
      };
      
      this.addToWorkingMemory(testItem);
      return this.workingMemory.length > 0;
    } catch {
      return false;
    }
  }
}
