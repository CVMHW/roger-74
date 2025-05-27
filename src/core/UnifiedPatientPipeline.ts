
/**
 * Unified Patient Pipeline Architecture
 * 
 * Integrates oldest and newest pipeline architectures into a single,
 * sophisticated system without redundancy. Every component uses
 * unilateral and unity-forming code patterns.
 */

import { MemoryService } from '../services/MemoryService';
import { EmotionAnalysis } from '../services/EmotionAnalysisService';

export interface UnifiedPatientContext {
  userInput: string;
  sessionId: string;
  messageCount: number;
  isNewSession: boolean;
  conversationHistory: string[];
  timestamp: number;
}

export interface UnifiedPatientResult {
  response: string;
  confidence: number;
  processingTimeMs: number;
  crisisDetected: boolean;
  systemsEngaged: string[];
  therapeuticQuality: number;
  pipelineRoute: 'crisis' | 'emotional' | 'complex' | 'greeting';
  memoryIntegration: {
    shortTerm: any[];
    workingMemory: any[];
    episodic: any[];
  };
}

/**
 * Unified Processing Engine - Single Source of Truth
 * Combines all legacy and modern pipeline capabilities
 */
export class UnifiedPatientPipeline {
  private memoryService: MemoryService;
  private processingCache: Map<string, any> = new Map();
  
  constructor() {
    this.memoryService = new MemoryService();
  }

  /**
   * Main unified processing method
   * Integrates all pipeline architectures into single flow
   */
  async process(context: UnifiedPatientContext): Promise<UnifiedPatientResult> {
    const startTime = Date.now();
    const systemsEngaged: string[] = [];
    
    // Stage 1: Unified Context Analysis (combines legacy + modern)
    const unifiedContext = await this.analyzeUnifiedContext(context);
    systemsEngaged.push('unified-context-analysis');
    
    // Stage 2: Intelligent Route Selection (sophisticated decision making)
    const route = this.selectOptimalRoute(unifiedContext);
    systemsEngaged.push(`route-selection-${route}`);
    
    // Stage 3: Crisis Priority Processing (highest priority)
    if (route === 'crisis') {
      return await this.processCrisisRoute(context, unifiedContext, startTime, systemsEngaged);
    }
    
    // Stage 4: Integrated Memory Processing (unified memory architecture)
    const memoryIntegration = await this.processUnifiedMemory(context, unifiedContext);
    systemsEngaged.push('unified-memory-integration');
    
    // Stage 5: Sophisticated Response Generation (combines all approaches)
    const response = await this.generateSophisticatedResponse(
      context,
      unifiedContext,
      memoryIntegration,
      route
    );
    systemsEngaged.push('sophisticated-response-generation');
    
    // Stage 6: Quality Optimization (unified enhancement)
    const optimizedResponse = this.optimizeResponseQuality(
      response,
      unifiedContext,
      memoryIntegration
    );
    
    return {
      response: optimizedResponse.text,
      confidence: optimizedResponse.confidence,
      processingTimeMs: Date.now() - startTime,
      crisisDetected: false,
      systemsEngaged,
      therapeuticQuality: optimizedResponse.quality,
      pipelineRoute: route,
      memoryIntegration
    };
  }

  /**
   * Unified Context Analysis - Combines all detection methods
   */
  private async analyzeUnifiedContext(context: UnifiedPatientContext): Promise<any> {
    const userInput = context.userInput.toLowerCase();
    
    // Unified emotion detection (combines all legacy methods)
    const emotionAnalysis = await this.unifiedEmotionDetection(context.userInput);
    
    // Unified crisis detection (combines all patterns)
    const crisisAnalysis = this.unifiedCrisisDetection(userInput);
    
    // Unified content analysis (sophisticated pattern recognition)
    const contentAnalysis = this.analyzeContentSophistication(userInput);
    
    return {
      emotion: emotionAnalysis,
      crisis: crisisAnalysis,
      content: contentAnalysis,
      complexity: this.assessComplexity(userInput, context.messageCount),
      therapeuticNeeds: this.assessTherapeuticNeeds(emotionAnalysis, context)
    };
  }

  /**
   * Intelligent Route Selection - Sophisticated decision making
   */
  private selectOptimalRoute(unifiedContext: any): 'crisis' | 'emotional' | 'complex' | 'greeting' {
    // Crisis takes absolute priority
    if (unifiedContext.crisis.detected) return 'crisis';
    
    // Greeting for early messages
    if (unifiedContext.complexity.isGreeting) return 'greeting';
    
    // Emotional route for emotional content
    if (unifiedContext.emotion.hasStrongEmotion) return 'emotional';
    
    // Complex route for sophisticated needs
    return 'complex';
  }

  /**
   * Unified Emotion Detection - Combines all legacy + modern methods
   */
  private async unifiedEmotionDetection(userInput: string): Promise<EmotionAnalysis> {
    const emotionPatterns = {
      'depression': {
        patterns: [
          /\b(depress(ed|ion|ing)?|sad|down|blue|low|hopeless|worthless|empty)\b/i,
          /\b(can't cope|overwhelming|breaking down|falling apart)\b/i
        ],
        valence: -0.8,
        arousal: 0.3
      },
      'anxiety': {
        patterns: [
          /\b(anxious|anxiety|worried|stress|panic|nervous|afraid|scared)\b/i,
          /\b(racing thoughts|can't stop worrying|heart racing)\b/i
        ],
        valence: -0.6,
        arousal: 0.8
      },
      'anger': {
        patterns: [
          /\b(angry|mad|furious|rage|irritated|frustrated|pissed)\b/i,
          /\b(can't stand|fed up|had enough)\b/i
        ],
        valence: -0.7,
        arousal: 0.9
      },
      'joy': {
        patterns: [
          /\b(happy|joy|excited|wonderful|amazing|great|fantastic)\b/i,
          /\b(feeling good|on top of the world|couldn't be better)\b/i
        ],
        valence: 0.8,
        arousal: 0.6
      }
    };

    // Sophisticated emotion detection combining multiple approaches
    for (const [emotion, config] of Object.entries(emotionPatterns)) {
      for (const pattern of config.patterns) {
        if (pattern.test(userInput)) {
          return {
            primaryEmotion: emotion,
            secondaryEmotions: [],
            intensity: this.calculateEmotionIntensity(userInput, emotion),
            valence: config.valence,
            arousal: config.arousal,
            confidence: 0.85,
            emotionalTriggers: [emotion]
          };
        }
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
   * Unified Crisis Detection - Combines all legacy patterns
   */
  private unifiedCrisisDetection(userInput: string): any {
    const crisisPatterns = [
      // Suicide indicators
      /\b(suicide|suicidal|kill myself|end my life|want to die|take my life)\b/i,
      /\b(don't want to live|better off dead|life isn't worth)\b/i,
      
      // Self-harm indicators
      /\b(harm myself|hurt myself|cut myself|cutting)\b/i,
      /\b(razor|blade|burn myself|self.harm)\b/i,
      
      // Substance crisis
      /\b(overdose|od|too many pills|can't stop drinking)\b/i,
      
      // Eating disorder crisis
      /\b(starving myself|haven't eaten|throwing up everything)\b/i
    ];

    for (const pattern of crisisPatterns) {
      if (pattern.test(userInput)) {
        return {
          detected: true,
          severity: this.assessCrisisSeverity(userInput),
          type: this.identifyCrisisType(userInput),
          immediacy: this.assessImmediacy(userInput)
        };
      }
    }

    return { detected: false };
  }

  /**
   * Crisis Route Processing - Immediate intervention
   */
  private async processCrisisRoute(
    context: UnifiedPatientContext,
    unifiedContext: any,
    startTime: number,
    systemsEngaged: string[]
  ): Promise<UnifiedPatientResult> {
    const crisisResponse = this.generateCrisisResponse(unifiedContext.crisis);
    
    // Record crisis event
    await this.memoryService.store(context.sessionId, {
      id: `crisis_${Date.now()}`,
      content: `CRISIS: ${context.userInput}`,
      timestamp: Date.now(),
      importance: 1.0,
      type: 'crisis_event'
    });

    return {
      response: crisisResponse,
      confidence: 0.95,
      processingTimeMs: Date.now() - startTime,
      crisisDetected: true,
      systemsEngaged: [...systemsEngaged, 'crisis-intervention'],
      therapeuticQuality: 0.95,
      pipelineRoute: 'crisis',
      memoryIntegration: {
        shortTerm: [],
        workingMemory: [],
        episodic: []
      }
    };
  }

  /**
   * Unified Memory Processing - Integrates all memory systems
   */
  private async processUnifiedMemory(
    context: UnifiedPatientContext,
    unifiedContext: any
  ): Promise<any> {
    // Short-term memory (recent conversation)
    const shortTermMemories = await this.getShortTermMemories(context);
    
    // Working memory (active context)
    const workingMemory = await this.getWorkingMemory(context, unifiedContext);
    
    // Episodic memory (important moments)
    const episodicMemory = await this.getEpisodicMemory(context, unifiedContext);
    
    return {
      shortTerm: shortTermMemories,
      workingMemory: workingMemory,
      episodic: episodicMemory
    };
  }

  /**
   * Sophisticated Response Generation - Unified approach
   */
  private async generateSophisticatedResponse(
    context: UnifiedPatientContext,
    unifiedContext: any,
    memoryIntegration: any,
    route: string
  ): Promise<any> {
    const baseResponse = this.generateBaseResponse(context, unifiedContext, route);
    
    // Apply sophisticated enhancements
    const enhancedResponse = this.applySophisticatedEnhancements(
      baseResponse,
      unifiedContext,
      memoryIntegration
    );
    
    return {
      text: enhancedResponse,
      confidence: this.calculateResponseConfidence(unifiedContext, memoryIntegration),
      quality: this.calculateTherapeuticQuality(enhancedResponse, unifiedContext)
    };
  }

  /**
   * Helper methods for sophisticated processing
   */
  private calculateEmotionIntensity(userInput: string, emotion: string): number {
    const intensifiers = /\b(very|really|extremely|so|totally|completely|absolutely)\b/i;
    const diminishers = /\b(a little|somewhat|kind of|sort of|maybe)\b/i;
    
    let baseIntensity = 0.6;
    
    if (intensifiers.test(userInput)) baseIntensity += 0.3;
    if (diminishers.test(userInput)) baseIntensity -= 0.2;
    
    return Math.max(0.1, Math.min(1.0, baseIntensity));
  }

  private assessCrisisSeverity(userInput: string): 'low' | 'moderate' | 'high' | 'critical' {
    if (/\b(plan|method|means|tonight|today|now|ready)\b/i.test(userInput)) {
      return 'critical';
    }
    if (/\b(thinking about|considering|want to)\b/i.test(userInput)) {
      return 'high';
    }
    return 'moderate';
  }

  private identifyCrisisType(userInput: string): string {
    if (/\b(suicide|suicidal|kill myself)\b/i.test(userInput)) return 'suicide';
    if (/\b(harm myself|hurt myself|cut)\b/i.test(userInput)) return 'self-harm';
    if (/\b(overdose|pills)\b/i.test(userInput)) return 'substance';
    return 'general';
  }

  private assessImmediacy(userInput: string): 'immediate' | 'urgent' | 'concerning' {
    if (/\b(tonight|today|now|ready|going to)\b/i.test(userInput)) return 'immediate';
    if (/\b(soon|planning|thinking about)\b/i.test(userInput)) return 'urgent';
    return 'concerning';
  }

  private generateCrisisResponse(crisisAnalysis: any): string {
    const baseResponse = "I'm very concerned about what you're sharing. Your safety is the most important thing right now.";
    
    if (crisisAnalysis.immediacy === 'immediate') {
      return `${baseResponse} Please call 988 (Suicide & Crisis Lifeline) immediately or go to your nearest emergency room. This is urgent.`;
    }
    
    return `${baseResponse} Please call 988 (Suicide & Crisis Lifeline) or text 988. Would you like me to provide additional resources?`;
  }

  private assessComplexity(userInput: string, messageCount: number): any {
    return {
      isGreeting: messageCount <= 2 && /\b(hello|hi|hey|good morning|good afternoon)\b/i.test(userInput),
      isComplex: userInput.length > 100 || messageCount > 5,
      requiresRAG: /\b(therapy|counseling|depression|anxiety|trauma)\b/i.test(userInput)
    };
  }

  private assessTherapeuticNeeds(emotionAnalysis: any, context: any): any {
    return {
      needsValidation: emotionAnalysis.intensity > 0.7,
      needsExploration: emotionAnalysis.primaryEmotion !== 'neutral',
      needsSupport: true
    };
  }

  private async getShortTermMemories(context: any): Promise<any[]> {
    return context.conversationHistory.slice(-3).map((msg: string, index: number) => ({
      id: `short_${index}`,
      content: msg,
      timestamp: Date.now(),
      importance: 0.7,
      type: 'short_term'
    }));
  }

  private async getWorkingMemory(context: any, unifiedContext: any): Promise<any[]> {
    return [{
      id: `working_${Date.now()}`,
      content: context.userInput,
      emotion: unifiedContext.emotion.primaryEmotion,
      timestamp: Date.now(),
      importance: 0.8,
      type: 'working'
    }];
  }

  private async getEpisodicMemory(context: any, unifiedContext: any): Promise<any[]> {
    if (unifiedContext.emotion.intensity > 0.8 || context.messageCount > 10) {
      return [{
        id: `episodic_${Date.now()}`,
        content: `Significant emotional moment: ${unifiedContext.emotion.primaryEmotion}`,
        timestamp: Date.now(),
        importance: 0.9,
        type: 'episodic'
      }];
    }
    return [];
  }

  private generateBaseResponse(context: any, unifiedContext: any, route: string): string {
    const emotion = unifiedContext.emotion.primaryEmotion;
    
    if (route === 'greeting') {
      return "I'm here to listen. What would you like to share with me today?";
    }
    
    if (route === 'emotional' && emotion !== 'neutral') {
      const responses = {
        'depression': "I can hear the sadness in what you're sharing. That sounds really difficult to carry.",
        'anxiety': "It sounds like you're feeling quite anxious about this. That must be exhausting.",
        'anger': "I can sense your frustration. That sounds really difficult to deal with.",
        'joy': "I can hear the happiness in what you're sharing. That sounds wonderful."
      };
      return responses[emotion] || "I hear what you're sharing. What would be most helpful to focus on right now?";
    }
    
    return "I'm listening. Could you tell me more about what's been going on?";
  }

  private applySophisticatedEnhancements(
    baseResponse: string,
    unifiedContext: any,
    memoryIntegration: any
  ): string {
    let enhanced = baseResponse;
    
    // Apply memory-based enhancements
    if (memoryIntegration.episodic.length > 0) {
      enhanced = `I remember we've talked about difficult feelings before. ${enhanced}`;
    }
    
    // Apply emotional validation
    if (unifiedContext.emotion.intensity > 0.7) {
      const validation = this.generateEmotionalValidation(unifiedContext.emotion);
      enhanced = `${validation} ${enhanced}`;
    }
    
    return enhanced;
  }

  private generateEmotionalValidation(emotion: any): string {
    const validations = {
      'depression': "I can really hear the pain in what you're sharing.",
      'anxiety': "That sounds incredibly overwhelming.",
      'anger': "I can feel how frustrated you are.",
      'joy': "I can hear the joy in your voice."
    };
    return validations[emotion.primaryEmotion] || "I hear the emotion in what you're sharing.";
  }

  private calculateResponseConfidence(unifiedContext: any, memoryIntegration: any): number {
    let confidence = 0.8;
    
    if (unifiedContext.emotion.confidence > 0.8) confidence += 0.1;
    if (memoryIntegration.shortTerm.length > 0) confidence += 0.05;
    if (unifiedContext.therapeuticNeeds.needsValidation) confidence += 0.05;
    
    return Math.min(confidence, 1.0);
  }

  private calculateTherapeuticQuality(response: string, unifiedContext: any): number {
    let quality = 0.7;
    
    // Check for emotional acknowledgment
    if (/\b(hear|feel|understand|sense)\b/i.test(response)) quality += 0.15;
    
    // Check for therapeutic language
    if (/\b(tell me more|what's that like|sounds like)\b/i.test(response)) quality += 0.1;
    
    // Check for validation
    if (unifiedContext.emotion.primaryEmotion !== 'neutral' && 
        /\b(difficult|hard|overwhelming|painful)\b/i.test(response)) {
      quality += 0.05;
    }
    
    return Math.min(quality, 1.0);
  }

  private optimizeResponseQuality(response: any, unifiedContext: any, memoryIntegration: any): any {
    // Final quality optimization
    let optimizedText = response.text;
    
    // Ensure appropriate length
    if (optimizedText.length > 200) {
      optimizedText = this.truncateGracefully(optimizedText, 180);
    }
    
    // Ensure therapeutic tone
    optimizedText = this.ensureTherapeuticTone(optimizedText);
    
    return {
      text: optimizedText,
      confidence: response.confidence,
      quality: response.quality
    };
  }

  private truncateGracefully(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    
    const sentences = text.split(/(?<=[.!?])\s+/);
    let result = '';
    
    for (const sentence of sentences) {
      if (result.length + sentence.length <= maxLength) {
        result += sentence + ' ';
      } else {
        break;
      }
    }
    
    return result.trim();
  }

  private ensureTherapeuticTone(text: string): string {
    // Ensure response maintains therapeutic, supportive tone
    return text.replace(/\b(you should|you need to|you must)\b/gi, 'you might consider')
               .replace(/\b(that's wrong|that's bad)\b/gi, 'that sounds difficult');
  }

  /**
   * Health check for unified system
   */
  async isHealthy(): Promise<boolean> {
    return await this.memoryService.isHealthy();
  }
}
