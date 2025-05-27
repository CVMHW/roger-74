
/**
 * Patient-Optimized Core System
 * 
 * Single, streamlined pipeline optimized for 30s-5min patient interactions
 * Eliminates redundancy and prioritizes therapeutic accuracy over system complexity
 */

import { MemoryService } from '../services/MemoryService';
import { EmotionAnalysis } from '../services/EmotionAnalysisService';

export interface PatientContext {
  userInput: string;
  sessionId: string;
  messageCount: number;
  isNewSession: boolean;
}

export interface OptimizedResult {
  response: string;
  confidence: number;
  processingTimeMs: number;
  crisisDetected: boolean;
  systemsUsed: string[];
  therapeuticQuality: number;
}

/**
 * Core patient-optimized processing engine
 */
export class PatientOptimizedCore {
  private memoryService: MemoryService;
  private lastProcessingTime: number = 0;

  constructor() {
    this.memoryService = new MemoryService();
  }

  /**
   * Main processing pipeline - optimized for speed and accuracy
   */
  async process(context: PatientContext): Promise<OptimizedResult> {
    const startTime = Date.now();
    const systemsUsed: string[] = [];

    try {
      // PRIORITY 1: Immediate crisis detection (< 100ms)
      const crisisResult = await this.detectCrisis(context.userInput);
      systemsUsed.push('crisis-detection');
      
      if (crisisResult.detected) {
        return {
          response: crisisResult.response,
          confidence: 0.95,
          processingTimeMs: Date.now() - startTime,
          crisisDetected: true,
          systemsUsed: [...systemsUsed, 'crisis-intervention'],
          therapeuticQuality: 0.95
        };
      }

      // PRIORITY 2: Fast emotion + memory processing (< 200ms)
      const [emotionAnalysis, memoryContext] = await Promise.all([
        this.analyzeEmotions(context.userInput),
        this.getMemoryContext(context.userInput, context.messageCount)
      ]);
      
      systemsUsed.push('emotion-analysis', 'memory-retrieval');

      // PRIORITY 3: Generate therapeutic response (< 300ms)
      const response = await this.generateTherapeuticResponse(
        context.userInput,
        emotionAnalysis,
        memoryContext,
        context.messageCount
      );
      
      systemsUsed.push('therapeutic-response');

      // PRIORITY 4: Quality optimization (< 100ms)
      const optimizedResponse = this.optimizeForPatient(response, emotionAnalysis);
      const therapeuticQuality = this.calculateTherapeuticQuality(optimizedResponse, emotionAnalysis);

      return {
        response: optimizedResponse,
        confidence: 0.85,
        processingTimeMs: Date.now() - startTime,
        crisisDetected: false,
        systemsUsed,
        therapeuticQuality
      };

    } catch (error) {
      console.error('Patient core processing error:', error);
      return this.getFallbackResponse(Date.now() - startTime);
    }
  }

  /**
   * Fast crisis detection optimized for patient safety
   */
  private async detectCrisis(userInput: string): Promise<{ detected: boolean; response: string }> {
    const crisisPatterns = [
      /\b(suicide|suicidal|kill myself|end my life|want to die)\b/i,
      /\b(harm myself|hurt myself|cut myself)\b/i,
      /\b(overdose|too many pills)\b/i
    ];

    for (const pattern of crisisPatterns) {
      if (pattern.test(userInput)) {
        return {
          detected: true,
          response: "I'm very concerned about what you're sharing. Your safety is the most important thing right now. Please call 988 (Suicide & Crisis Lifeline) immediately or go to your nearest emergency room. Would you like me to provide additional resources?"
        };
      }
    }

    return { detected: false, response: '' };
  }

  /**
   * Fast emotion analysis for therapeutic context
   */
  private async analyzeEmotions(userInput: string): Promise<EmotionAnalysis> {
    const emotionPatterns = {
      'depressed': { pattern: /\b(depress(ed|ion)?|sad|down|hopeless|worthless)\b/i, valence: -0.8, arousal: 0.3 },
      'anxious': { pattern: /\b(anxious|anxiety|worried|panic|nervous)\b/i, valence: -0.6, arousal: 0.8 },
      'angry': { pattern: /\b(angry|mad|furious|rage|frustrated)\b/i, valence: -0.7, arousal: 0.9 },
      'happy': { pattern: /\b(happy|joy|good|great|wonderful)\b/i, valence: 0.8, arousal: 0.6 }
    };

    for (const [emotion, config] of Object.entries(emotionPatterns)) {
      if (config.pattern.test(userInput)) {
        return {
          primaryEmotion: emotion,
          secondaryEmotions: [],
          intensity: this.calculateIntensity(userInput),
          valence: config.valence,
          arousal: config.arousal,
          confidence: 0.8,
          emotionalTriggers: [emotion]
        };
      }
    }

    return {
      primaryEmotion: 'neutral',
      secondaryEmotions: [],
      intensity: 0.5,
      valence: 0,
      arousal: 0.5,
      confidence: 0.6,
      emotionalTriggers: []
    };
  }

  /**
   * Optimized memory context retrieval
   */
  private async getMemoryContext(userInput: string, messageCount: number) {
    if (messageCount < 2) {
      return {
        relevantItems: [],
        currentFocus: 'opening',
        conversationPhase: 'greeting'
      };
    }

    return await this.memoryService.retrieve('current', userInput);
  }

  /**
   * Generate therapeutic response optimized for patient care
   */
  private async generateTherapeuticResponse(
    userInput: string,
    emotion: EmotionAnalysis,
    memory: any,
    messageCount: number
  ): Promise<string> {
    // Early conversation responses
    if (messageCount < 3) {
      if (emotion.primaryEmotion !== 'neutral') {
        return `I hear that you're feeling ${emotion.primaryEmotion}. That sounds really difficult. Could you tell me more about what's been going on?`;
      }
      return "I'm here to listen. What would you like to share with me today?";
    }

    // Established conversation responses
    const responses = {
      'depressed': "I can hear the sadness in what you're sharing. That sounds incredibly heavy to carry. What has this been like for you day to day?",
      'anxious': "It sounds like you're feeling really anxious about this. That must be exhausting. What aspects of this worry you the most?",
      'angry': "I can sense your frustration. That sounds really difficult to deal with. What's been the hardest part about this situation?",
      'neutral': "I'm hearing what you're sharing. What would be most helpful to focus on right now?"
    };

    return responses[emotion.primaryEmotion] || responses['neutral'];
  }

  /**
   * Optimize response for patient therapeutic needs
   */
  private optimizeForPatient(response: string, emotion: EmotionAnalysis): string {
    // Ensure emotional validation for high-intensity emotions
    if (emotion.intensity > 0.7 && emotion.primaryEmotion !== 'neutral') {
      const validationPhrases = {
        'depressed': "I can really hear the pain in what you're sharing.",
        'anxious': "That sounds incredibly overwhelming.",
        'angry': "I can feel how frustrated you are."
      };
      
      const validation = validationPhrases[emotion.primaryEmotion];
      if (validation && !response.includes('hear') && !response.includes('feel')) {
        return `${validation} ${response}`;
      }
    }

    return response;
  }

  /**
   * Calculate therapeutic quality score
   */
  private calculateTherapeuticQuality(response: string, emotion: EmotionAnalysis): number {
    let quality = 0.7;

    // Emotional acknowledgment
    if (emotion.primaryEmotion !== 'neutral' && /\b(hear|feel|sense|understand)\b/i.test(response)) {
      quality += 0.15;
    }

    // Therapeutic language
    if (/\b(tell me more|what's that like|sounds like|what has this been like)\b/i.test(response)) {
      quality += 0.1;
    }

    // Crisis safety
    if (/\b(988|crisis|emergency|safety)\b/i.test(response)) {
      quality += 0.05;
    }

    return Math.min(quality, 1.0);
  }

  /**
   * Calculate emotion intensity
   */
  private calculateIntensity(userInput: string): number {
    const intensifiers = /\b(very|really|extremely|so|totally|completely|absolutely)\b/i;
    return intensifiers.test(userInput) ? 0.9 : 0.6;
  }

  /**
   * Fallback response for errors
   */
  private getFallbackResponse(processingTime: number): OptimizedResult {
    return {
      response: "I'm here to listen and support you. What would you like to share?",
      confidence: 0.7,
      processingTimeMs: processingTime,
      crisisDetected: false,
      systemsUsed: ['fallback'],
      therapeuticQuality: 0.8
    };
  }

  /**
   * Health check
   */
  async isHealthy(): Promise<boolean> {
    return await this.memoryService.isHealthy();
  }
}
