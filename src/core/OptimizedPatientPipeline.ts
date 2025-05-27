
/**
 * Optimized Patient Pipeline
 * 
 * Consolidates all systems into a single efficient flow optimized for patient care
 * Eliminates redundancy and prioritizes response time and therapeutic accuracy
 */

import { EmotionAnalysis } from '../services/EmotionAnalysisService';
import { MemoryContext } from '../services/MemoryService';
import { RAGService, RAGContext, RAGResult } from '../services/RAGService';
import { CrisisService } from '../services/CrisisService';
import { PersonalityService } from '../services/PersonalityService';
import { ResponseService } from '../services/ResponseService';

export interface OptimizedPipelineContext {
  userInput: string;
  conversationHistory: string[];
  sessionId: string;
  messageCount: number;
  timestamp: number;
}

export interface OptimizedPipelineResult {
  response: string;
  confidence: number;
  processingTime: number;
  systemsEngaged: string[];
  crisisDetected: boolean;
  therapeuticQuality: number;
  wasOptimized: boolean;
}

/**
 * Optimized Pipeline for Maximum Patient Care Efficiency
 */
export class OptimizedPatientPipeline {
  private ragService: RAGService;
  private crisisService: CrisisService;
  private personalityService: PersonalityService;
  private responseService: ResponseService;

  constructor() {
    this.ragService = new RAGService();
    this.crisisService = new CrisisService();
    this.personalityService = new PersonalityService();
    this.responseService = new ResponseService();
  }

  /**
   * Main optimized processing pipeline
   */
  async process(context: OptimizedPipelineContext): Promise<OptimizedPipelineResult> {
    const startTime = Date.now();
    const systemsEngaged: string[] = [];

    try {
      // Stage 1: Immediate Crisis Detection (HIGHEST PRIORITY)
      const crisisCheck = await this.crisisService.detectCrisis(context.userInput);
      systemsEngaged.push('crisis-detection');
      
      if (crisisCheck.isCrisis) {
        const crisisResponse = await this.crisisService.generateCrisisResponse(
          context.userInput,
          crisisCheck.crisisType
        );
        
        return {
          response: crisisResponse.response,
          confidence: crisisResponse.confidence,
          processingTime: Date.now() - startTime,
          systemsEngaged: [...systemsEngaged, 'crisis-intervention'],
          crisisDetected: true,
          therapeuticQuality: 0.95,
          wasOptimized: true
        };
      }

      // Stage 2: Parallel Processing for Efficiency
      const [emotionAnalysis, memoryContext, personalityInsights] = await Promise.all([
        this.extractEmotions(context.userInput),
        this.getMemoryContext(context.userInput, context.conversationHistory),
        this.personalityService.analyzePersonality(context.userInput)
      ]);
      
      systemsEngaged.push('emotion-analysis', 'memory-retrieval', 'personality-analysis');

      // Stage 3: Smart RAG Application (only when beneficial)
      let ragResult: RAGResult | null = null;
      const shouldApplyRAG = this.shouldApplyRAG(context.userInput, emotionAnalysis, context.messageCount);
      
      if (shouldApplyRAG) {
        ragResult = await this.ragService.enhance(
          context.userInput,
          memoryContext,
          emotionAnalysis,
          context.conversationHistory
        );
        systemsEngaged.push('rag-enhancement');
      }

      // Stage 4: Response Generation with Context Integration
      const response = await this.responseService.generateResponse({
        userInput: context.userInput,
        emotionAnalysis,
        memoryContext,
        personalityInsights,
        ragContext: ragResult?.enhancedContext || [],
        conversationHistory: context.conversationHistory
      });

      systemsEngaged.push('response-generation');

      // Stage 5: Quality Optimization
      const optimizedResponse = this.optimizeForPatient(response, emotionAnalysis);
      const therapeuticQuality = this.calculateTherapeuticQuality(
        optimizedResponse,
        emotionAnalysis,
        ragResult
      );

      return {
        response: optimizedResponse,
        confidence: response.confidence * (ragResult?.confidence || 1.0),
        processingTime: Date.now() - startTime,
        systemsEngaged,
        crisisDetected: false,
        therapeuticQuality,
        wasOptimized: true
      };

    } catch (error) {
      console.error('Optimized pipeline error:', error);
      
      return {
        response: "I'm here to listen and support you. What would you like to share?",
        confidence: 0.7,
        processingTime: Date.now() - startTime,
        systemsEngaged: ['fallback'],
        crisisDetected: false,
        therapeuticQuality: 0.8,
        wasOptimized: false
      };
    }
  }

  /**
   * Extract emotions efficiently
   */
  private async extractEmotions(userInput: string): Promise<EmotionAnalysis> {
    // Fast emotion detection optimized for therapy
    const emotionPatterns = {
      'depressed': /\b(depress(ed|ion|ing)?|sad|down|blue|low|hopeless|worthless)\b/i,
      'anxious': /\b(anxious|anxiety|worried|stress|panic|nervous)\b/i,
      'angry': /\b(angry|mad|furious|rage|irritated|frustrated)\b/i,
      'happy': /\b(happy|joy|good|great|wonderful|amazing)\b/i
    };

    for (const [emotion, pattern] of Object.entries(emotionPatterns)) {
      if (pattern.test(userInput)) {
        return {
          primaryEmotion: emotion,
          intensity: this.calculateIntensity(userInput, emotion),
          confidence: 0.8
        };
      }
    }

    return {
      primaryEmotion: 'neutral',
      intensity: 0.5,
      confidence: 0.6
    };
  }

  /**
   * Get memory context efficiently
   */
  private async getMemoryContext(userInput: string, history: string[]): Promise<MemoryContext> {
    const recentHistory = history.slice(-3); // Only use last 3 messages for efficiency
    
    return {
      relevantItems: recentHistory.map(msg => ({
        content: msg,
        timestamp: Date.now(),
        importance: 0.7
      })),
      currentFocus: this.extractMainTopic(userInput),
      conversationPhase: history.length < 3 ? 'opening' : 'developing'
    };
  }

  /**
   * Determine if RAG should be applied
   */
  private shouldApplyRAG(userInput: string, emotion: EmotionAnalysis, messageCount: number): boolean {
    // Don't apply RAG for simple greetings or very early messages
    if (messageCount < 2 || userInput.length < 20) return false;
    
    // Apply RAG for complex emotional content
    const complexEmotions = ['depressed', 'anxious', 'confused'];
    if (complexEmotions.includes(emotion.primaryEmotion) && emotion.intensity > 0.6) {
      return true;
    }
    
    // Apply RAG for specific therapeutic topics
    const therapeuticTopics = /\b(therapy|counseling|depression|anxiety|trauma|relationship)\b/i;
    return therapeuticTopics.test(userInput);
  }

  /**
   * Optimize response for patient care
   */
  private optimizeForPatient(response: string, emotion: EmotionAnalysis): string {
    // Ensure emotional validation is present
    if (emotion.primaryEmotion !== 'neutral' && emotion.intensity > 0.7) {
      const validationPhrases = {
        'depressed': "I hear that you're feeling really down.",
        'anxious': "It sounds like you're feeling quite anxious.",
        'angry': "I can sense your frustration.",
        'sad': "I can hear the sadness in what you're sharing."
      };
      
      const validation = validationPhrases[emotion.primaryEmotion];
      if (validation && !response.toLowerCase().includes('feel') && !response.toLowerCase().includes('hear')) {
        return `${validation} ${response}`;
      }
    }
    
    return response;
  }

  /**
   * Calculate therapeutic quality score
   */
  private calculateTherapeuticQuality(
    response: string,
    emotion: EmotionAnalysis,
    ragResult: RAGResult | null
  ): number {
    let quality = 0.7; // Base quality
    
    // Check for emotional acknowledgment
    if (emotion.primaryEmotion !== 'neutral') {
      const hasEmotionalResponse = /\b(feel|hear|understand|sense)\b/i.test(response);
      if (hasEmotionalResponse) quality += 0.1;
    }
    
    // Check for therapeutic language
    const therapeuticPhrases = /\b(tell me more|how does that|what's that like|sounds like)\b/i;
    if (therapeuticPhrases.test(response)) quality += 0.1;
    
    // RAG enhancement bonus
    if (ragResult && ragResult.wasApplied) quality += 0.1;
    
    return Math.min(quality, 1.0);
  }

  /**
   * Calculate emotion intensity
   */
  private calculateIntensity(userInput: string, emotion: string): number {
    const intensifiers = /\b(very|really|extremely|so|totally|completely)\b/i;
    const baseIntensity = 0.6;
    
    return intensifiers.test(userInput) ? Math.min(baseIntensity + 0.3, 1.0) : baseIntensity;
  }

  /**
   * Extract main topic from user input
   */
  private extractMainTopic(userInput: string): string {
    const topics = {
      'relationships': /\b(relationship|partner|spouse|marriage|dating)\b/i,
      'work': /\b(work|job|career|boss|colleague)\b/i,
      'family': /\b(family|parent|child|sibling|mom|dad)\b/i,
      'mental_health': /\b(depression|anxiety|therapy|counseling)\b/i
    };

    for (const [topic, pattern] of Object.entries(topics)) {
      if (pattern.test(userInput)) return topic;
    }

    return 'general';
  }

  /**
   * Health check for optimized pipeline
   */
  async isHealthy(): Promise<boolean> {
    try {
      const services = await Promise.all([
        this.ragService.isHealthy(),
        this.crisisService.isHealthy(),
        this.personalityService.isHealthy(),
        this.responseService.isHealthy()
      ]);
      
      return services.every(status => status);
    } catch {
      return false;
    }
  }
}
