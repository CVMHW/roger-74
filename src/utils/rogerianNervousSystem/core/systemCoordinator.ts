
/**
 * System Coordinator - Unified Nervous System Processor
 * 
 * Coordinates all of Roger's systems using consistent types and interfaces
 * This replaces the previous nervousSystemIntegrator with cleaner architecture
 */

import { 
  NervousSystemContext, 
  ProcessingResult, 
  EmotionalContext,
  MemoryContext,
  CrisisContext,
  RAGContext,
  PersonalityInsights,
  SmallTalkContext,
  SystemName,
  EmotionType,
  SeverityLevel
} from './types';

// Import processors with unified interfaces
import { processEmotions } from '../processors/emotionProcessor';
import { processMemory } from '../processors/memoryProcessor';
import { processCrisis } from '../processors/crisisProcessor';
import { processRAG } from '../processors/ragProcessor';
import { processPersonality } from '../processors/personalityProcessor';
import { processSmallTalk } from '../processors/smallTalkProcessor';

/**
 * Main nervous system coordinator
 */
export class NervousSystemCoordinator {
  private systemsEngaged: SystemName[] = [];
  private processingStartTime: number = 0;

  /**
   * Process user input through all systems
   */
  async processInput(
    originalResponse: string,
    userInput: string,
    conversationHistory: string[] = [],
    messageCount: number = 0,
    updateStage?: () => void
  ): Promise<ProcessingResult> {
    this.processingStartTime = Date.now();
    this.systemsEngaged = [];
    
    console.log("NERVOUS SYSTEM COORDINATOR: Starting unified processing");

    // PHASE 1: CRISIS DETECTION (HIGHEST PRIORITY)
    const crisisContext = await processCrisis(userInput, updateStage);
    if (crisisContext.isCrisisDetected) {
      this.systemsEngaged.push('crisis-detection');
      return this.createCrisisResult(originalResponse, userInput, conversationHistory, messageCount, crisisContext);
    }

    // PHASE 2: SMALL TALK DETECTION
    const smallTalkContext = await processSmallTalk(userInput, conversationHistory);
    
    // PHASE 3: EMOTIONAL ANALYSIS
    const emotionalContext = await processEmotions(userInput, conversationHistory);
    this.systemsEngaged.push('emotion-analysis');

    // PHASE 4: MEMORY PROCESSING
    const memoryContext = await processMemory(userInput, emotionalContext, messageCount);
    this.systemsEngaged.push('memory-storage');

    // PHASE 5: PERSONALITY INSIGHTS
    const personalityInsights = await processPersonality(userInput, emotionalContext);
    if (personalityInsights.shouldIncludeInsight) {
      this.systemsEngaged.push('personality-integration');
    }

    // PHASE 6: RAG PROCESSING
    const ragContext = await processRAG(userInput, emotionalContext, conversationHistory, smallTalkContext);
    if (ragContext.shouldApplyRAG) {
      this.systemsEngaged.push('rag-enhancement');
    }

    // PHASE 7: RESPONSE ENHANCEMENT
    let enhancedResponse = await this.enhanceResponse(
      originalResponse,
      userInput,
      conversationHistory,
      emotionalContext,
      personalityInsights,
      ragContext
    );

    // PHASE 8: FINAL VERIFICATION
    enhancedResponse = this.performFinalVerification(enhancedResponse, emotionalContext);

    const context: NervousSystemContext = {
      userInput,
      conversationHistory,
      messageCount,
      emotionalContext,
      personalityInsights,
      memoryContext,
      crisisContext,
      ragContext,
      smallTalkContext
    };

    const processingTime = Date.now() - this.processingStartTime;

    return {
      enhancedResponse,
      context,
      systemsEngaged: this.systemsEngaged,
      processingTime,
      confidence: this.calculateOverallConfidence(context)
    };
  }

  private async enhanceResponse(
    response: string,
    userInput: string,
    history: string[],
    emotional: EmotionalContext,
    personality: PersonalityInsights,
    rag: RAGContext
  ): Promise<string> {
    let enhanced = response;

    // Apply core processing
    enhanced = await this.applyCoreProcessing(enhanced, userInput, history, emotional);
    this.systemsEngaged.push('core-processing');

    // Apply RAG enhancement if needed
    if (rag.shouldApplyRAG && rag.retrievedKnowledge && rag.retrievedKnowledge.length > 0) {
      enhanced = await this.applyRAGEnhancement(enhanced, userInput, rag);
    }

    // Apply personality insights
    if (personality.shouldIncludeInsight && personality.insight) {
      enhanced = this.integratePersonalityInsight(enhanced, personality.insight);
    }

    return enhanced;
  }

  private async applyCoreProcessing(
    response: string,
    userInput: string,
    history: string[],
    emotional: EmotionalContext
  ): Promise<string> {
    // Import and apply core processing functions
    const { processResponse } = await import('../../response/processor');
    return processResponse(response, userInput, history, emotional);
  }

  private async applyRAGEnhancement(
    response: string,
    userInput: string,
    rag: RAGContext
  ): Promise<string> {
    // Apply RAG enhancement with retrieved knowledge
    if (rag.retrievedKnowledge && rag.retrievedKnowledge.length > 0) {
      const contextText = rag.retrievedKnowledge.join(" ");
      
      // Sophisticated integration of retrieved knowledge
      if (rag.confidence && rag.confidence > 0.8) {
        // High confidence - integrate naturally
        return this.integrateKnowledgeNaturally(response, contextText);
      } else {
        // Lower confidence - add as supporting information
        return this.addSupportingContext(response, contextText);
      }
    }
    return response;
  }

  private integratePersonalityInsight(response: string, insight: string): string {
    const sentences = response.split(/(?<=[.!?])\s+/);
    
    if (sentences.length > 2) {
      const insertionPoint = Math.min(2, sentences.length - 1);
      const firstPart = sentences.slice(0, insertionPoint).join(' ');
      const secondPart = sentences.slice(insertionPoint).join(' ');
      return `${firstPart} ${insight} ${secondPart}`;
    } else {
      return `${response} ${insight}`;
    }
  }

  private integrateKnowledgeNaturally(response: string, knowledge: string): string {
    // Sophisticated natural integration of knowledge
    const sentences = response.split(/(?<=[.!?])\s+/);
    if (sentences.length > 1) {
      const insertPoint = Math.floor(sentences.length / 2);
      const relevantKnowledge = this.extractRelevantKnowledge(knowledge, response);
      
      return [
        ...sentences.slice(0, insertPoint),
        relevantKnowledge,
        ...sentences.slice(insertPoint)
      ].join(' ');
    }
    return response;
  }

  private addSupportingContext(response: string, context: string): string {
    // Add as supporting context with lower confidence
    const relevantContext = this.extractRelevantKnowledge(context, response);
    return `${response} ${relevantContext}`;
  }

  private extractRelevantKnowledge(knowledge: string, response: string): string {
    // Extract the most relevant portion of knowledge for the response
    const knowledgeWords = knowledge.toLowerCase().split(/\s+/);
    const responseWords = response.toLowerCase().split(/\s+/);
    
    // Find overlapping concepts
    const overlap = knowledgeWords.filter(word => 
      responseWords.some(respWord => respWord.includes(word) || word.includes(respWord))
    );
    
    if (overlap.length > 0) {
      // Extract sentences containing overlapping concepts
      const sentences = knowledge.split(/[.!?]+/);
      const relevantSentences = sentences.filter(sentence =>
        overlap.some(word => sentence.toLowerCase().includes(word))
      );
      
      return relevantSentences.slice(0, 2).join('. ') + '.';
    }
    
    // Fallback to first sentence
    return knowledge.split(/[.!?]+/)[0] + '.';
  }

  private performFinalVerification(response: string, emotional: EmotionalContext): string {
    // Critical depression check
    if (emotional.isDepressionMentioned && 
        !/\b(depress(ed|ing|ion)?|difficult|hard time|sorry to hear)\b/i.test(response.toLowerCase())) {
      console.log("COORDINATOR: CRITICAL - Adding depression acknowledgment");
      return "I'm really sorry to hear you're feeling depressed. " + response;
    }
    return response;
  }

  private createCrisisResult(
    originalResponse: string,
    userInput: string,
    conversationHistory: string[],
    messageCount: number,
    crisisContext: CrisisContext
  ): ProcessingResult {
    return {
      enhancedResponse: "I'm very concerned about what you've shared. Please reach out to a crisis hotline or emergency services immediately if you're in danger.",
      context: {
        userInput,
        conversationHistory,
        messageCount,
        emotionalContext: { hasDetectedEmotion: true, isDepressionMentioned: true, primaryEmotion: 'depression' as EmotionType },
        personalityInsights: { shouldIncludeInsight: false },
        memoryContext: { relevantMemories: [], isNewConversation: false, conversationThemes: ['crisis'] },
        crisisContext,
        ragContext: { shouldApplyRAG: false }
      },
      systemsEngaged: this.systemsEngaged,
      processingTime: Date.now() - this.processingStartTime,
      confidence: 1.0
    };
  }

  private calculateOverallConfidence(context: NervousSystemContext): number {
    const confidences = [
      context.emotionalContext.confidence || 0.5,
      context.ragContext.confidence || 0.5,
      context.personalityInsights.confidence || 0.5
    ];
    
    return confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
  }
}

// Export singleton instance
export const nervousSystemCoordinator = new NervousSystemCoordinator();
