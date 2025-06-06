
/**
 * Patient Router - Unified Integration
 * 
 * Now acts as a facade to the unified pipeline system
 * Maintains backward compatibility while eliminating redundancy
 */

import { unifiedPipelineRouter } from './UnifiedPipelineRouter';
import { UnifiedPatientResult } from './UnifiedPatientPipeline';

export class PatientRouter {
  private sessionMessageCount: number = 0;

  constructor() {
    console.log('PATIENT ROUTER: Initialized with unified pipeline integration');
  }

  /**
   * Route patient input through unified pipeline (legacy compatibility)
   */
  async route(userInput: string): Promise<UnifiedPatientResult> {
    this.sessionMessageCount++;
    
    console.log(`PATIENT ROUTER: Delegating to unified pipeline (message ${this.sessionMessageCount})`);
    
    const result = await unifiedPipelineRouter.route(userInput, []);
    
    // Convert IntegratedResponse to UnifiedPatientResult for backward compatibility
    return {
      response: result.text,
      confidence: result.confidence,
      processingTimeMs: result.processingTimeMs,
      crisisDetected: result.emotionDetected && result.text.includes('crisis'),
      systemsEngaged: result.systemsUsed,
      therapeuticQuality: result.confidence,
      pipelineRoute: this.determinePipelineRoute(result.systemsUsed, userInput),
      memoryIntegration: {
        relevantItems: [],
        currentFocus: this.extractMainTopic(userInput),
        conversationPhase: this.sessionMessageCount < 3 ? 'opening' : 'developing'
      },
      legacyCompatible: true
    };
  }

  /**
   * Determine pipeline route based on systems used and user input
   */
  private determinePipelineRoute(systemsUsed: string[], userInput: string): "crisis" | "emotional" | "complex" | "greeting" {
    // Check for crisis content
    if (systemsUsed.includes('legacy-pipeline') && /\b(suicide|kill myself|self-harm|overdose|end my life|want to die|hopeless|despair|worthless|powerless)\b/i.test(userInput)) {
      return 'crisis';
    }
    
    // Check for greeting
    if (userInput.length < 50 && /^(hi|hello|hey|good morning|good afternoon|good evening|how are you|what's up)\.?!?\s*$/i.test(userInput)) {
      return 'greeting';
    }
    
    // Check for emotional content
    if (systemsUsed.includes('unified-emotion-detection') || systemsUsed.includes('nervous-system-emotion-processor')) {
      return 'emotional';
    }
    
    // Default to complex for everything else
    return 'complex';
  }

  /**
   * Extract main topic from user input for memory context
   */
  private extractMainTopic(userInput: string): string {
    const topics = {
      'relationships': /\b(relationship|partner|spouse|family|friend|love)\b/i,
      'work': /\b(work|job|career|boss|colleague|employment)\b/i,
      'health': /\b(health|medical|doctor|hospital|illness|sick)\b/i,
      'emotions': /\b(feel|emotion|sad|happy|angry|anxious|depressed)\b/i
    };

    for (const [topic, pattern] of Object.entries(topics)) {
      if (pattern.test(userInput)) return topic;
    }

    return 'general';
  }

  /**
   * Reset session for new patient
   */
  resetSession(): void {
    this.sessionMessageCount = 0;
    unifiedPipelineRouter.resetSession();
  }
}

// Export singleton for backward compatibility
export const patientRouter = new PatientRouter();
