
/**
 * Unified Roger Pipeline
 * 
 * Main orchestrator that coordinates all systems:
 * - Crisis detection and intervention
 * - Emotion analysis and attunement
 * - Memory retrieval and storage
 * - RAG enhancement with vector search
 * - Personality integration
 * - Response generation
 * - Hallucination prevention
 * - HIPAA compliance and audit logging
 */

import { RogerNervousSystemContext } from '../utils/rogerianNervousSystem';
import { RAGService } from '../services/RAGService';
import { MemoryService } from '../services/MemoryService';
import { ResponseService } from '../services/ResponseService';
import { HIPAACompliance } from '../utils/HIPAACompliance';
import { CrisisInterventionService } from '../services/CrisisInterventionService';
import { EmotionAnalysisService } from '../services/EmotionAnalysisService';
import { PersonalityService } from '../services/PersonalityService';

export interface PipelineContext {
  userInput: string;
  conversationHistory: string[];
  userId?: string;
  sessionId: string;
  timestamp: number;
  clientPreferences?: any;
  emergencyContext?: boolean;
}

export interface PipelineResult {
  response: string;
  confidence: number;
  processingTime: number;
  wasEnhanced: boolean;
  crisisDetected: boolean;
  auditTrail: string[];
  memoryUpdated: boolean;
}

/**
 * Main Unified Roger Pipeline
 * Processes user input through all integrated systems
 */
export class UnifiedRogerPipeline {
  private ragService: RAGService;
  private memoryService: MemoryService;
  private responseService: ResponseService;
  private hipaaCompliance: HIPAACompliance;
  private crisisService: CrisisInterventionService;
  private emotionService: EmotionAnalysisService;
  private personalityService: PersonalityService;

  constructor() {
    this.ragService = new RAGService();
    this.memoryService = new MemoryService();
    this.responseService = new ResponseService();
    this.hipaaCompliance = new HIPAACompliance();
    this.crisisService = new CrisisInterventionService();
    this.emotionService = new EmotionAnalysisService();
    this.personalityService = new PersonalityService();
  }

  /**
   * Main processing pipeline
   * Follows the unified flow: Input → Crisis → Emotion → Memory → RAG → Personality → Response → Prevention → Output
   */
  async process(context: PipelineContext): Promise<PipelineResult> {
    const startTime = Date.now();
    const auditTrail: string[] = [];
    
    try {
      // HIPAA logging and compliance check
      await this.hipaaCompliance.logInteraction(context);
      auditTrail.push('HIPAA compliance logged');

      // Phase 1: Crisis Detection (HIGHEST PRIORITY)
      const crisisResult = await this.crisisService.analyze(context.userInput);
      auditTrail.push(`Crisis analysis: ${crisisResult.level}`);
      
      if (crisisResult.requiresImmediate) {
        const crisisResponse = await this.crisisService.generateResponse(crisisResult);
        await this.memoryService.recordCrisis(context.userInput, crisisResponse, crisisResult);
        
        return {
          response: crisisResponse,
          confidence: 0.95,
          processingTime: Date.now() - startTime,
          wasEnhanced: false,
          crisisDetected: true,
          auditTrail,
          memoryUpdated: true
        };
      }

      // Phase 2: Emotion Analysis and Attunement
      const emotionAnalysis = await this.emotionService.analyze(context.userInput);
      auditTrail.push(`Emotion detected: ${emotionAnalysis.primaryEmotion}`);

      // Phase 3: Memory Retrieval and Context Building
      const memoryContext = await this.memoryService.retrieveRelevantContext(
        context.userInput,
        context.conversationHistory,
        emotionAnalysis
      );
      auditTrail.push(`Memory context retrieved: ${memoryContext.relevantItems.length} items`);

      // Phase 4: RAG Enhancement with Unified Search
      const ragEnhancement = await this.ragService.enhance(
        context.userInput,
        memoryContext,
        emotionAnalysis,
        context.conversationHistory
      );
      auditTrail.push(`RAG enhancement applied: confidence ${ragEnhancement.confidence}`);

      // Phase 5: Personality Integration
      const personalityContext = await this.personalityService.getContextualPersonality(
        context.userInput,
        emotionAnalysis,
        context.conversationHistory.length
      );
      auditTrail.push('Personality context integrated');

      // Phase 6: Response Generation with Unified Processing
      const responseResult = await this.responseService.generate({
        userInput: context.userInput,
        emotionAnalysis,
        memoryContext,
        ragEnhancement,
        personalityContext,
        conversationHistory: context.conversationHistory,
        crisisLevel: crisisResult.level
      });
      auditTrail.push('Response generated');

      // Phase 7: Hallucination Prevention and Quality Assurance
      const finalResponse = await this.responseService.preventHallucinations(
        responseResult.text,
        context.userInput,
        context.conversationHistory,
        memoryContext
      );
      auditTrail.push('Hallucination prevention applied');

      // Phase 8: Memory Update and Learning
      await this.memoryService.updateWithInteraction(
        context.userInput,
        finalResponse.text,
        emotionAnalysis,
        responseResult.confidence
      );
      auditTrail.push('Memory updated');

      // HIPAA audit trail completion
      await this.hipaaCompliance.completeAuditTrail(context.sessionId, auditTrail);

      return {
        response: finalResponse.text,
        confidence: responseResult.confidence * finalResponse.confidence,
        processingTime: Date.now() - startTime,
        wasEnhanced: ragEnhancement.wasApplied || finalResponse.wasModified,
        crisisDetected: crisisResult.level !== 'none',
        auditTrail,
        memoryUpdated: true
      };

    } catch (error) {
      console.error('Pipeline processing error:', error);
      auditTrail.push(`Error: ${error.message}`);
      
      // Fallback response with error handling
      const fallbackResponse = await this.generateFallbackResponse(context.userInput, crisisResult?.level || 'none');
      
      return {
        response: fallbackResponse,
        confidence: 0.3,
        processingTime: Date.now() - startTime,
        wasEnhanced: false,
        crisisDetected: crisisResult?.level !== 'none' || false,
        auditTrail,
        memoryUpdated: false
      };
    }
  }

  /**
   * Generates fallback response in case of system errors
   */
  private async generateFallbackResponse(userInput: string, crisisLevel: string): Promise<string> {
    if (crisisLevel === 'high' || crisisLevel === 'critical') {
      return "I'm concerned about what you've shared. Please reach out to a crisis hotline or emergency services immediately. You can call 988 or 911 for immediate help.";
    }
    
    if (userInput.length < 20) {
      return "I hear you. Could you tell me a bit more about what's on your mind?";
    }
    
    return "I'm listening and want to understand what you're going through. Sometimes it helps to talk about what's most important to you right now.";
  }

  /**
   * Health check for all pipeline components
   */
  async healthCheck(): Promise<{ healthy: boolean; services: Record<string, boolean> }> {
    const services = {
      rag: await this.ragService.isHealthy(),
      memory: await this.memoryService.isHealthy(),
      response: await this.responseService.isHealthy(),
      crisis: await this.crisisService.isHealthy(),
      emotion: await this.emotionService.isHealthy(),
      personality: await this.personalityService.isHealthy(),
      hipaa: await this.hipaaCompliance.isHealthy()
    };

    const healthy = Object.values(services).every(status => status);
    return { healthy, services };
  }
}

// Export singleton instance
export const unifiedPipeline = new UnifiedRogerPipeline();
