
/**
 * Patient-Focused Router
 * 
 * Simplified routing that prioritizes patient care over system complexity
 */

import { PatientOptimizedCore, PatientContext, OptimizedResult } from './PatientOptimizedCore';

export class PatientRouter {
  private patientCore: PatientOptimizedCore;
  private sessionMessageCount: number = 0;

  constructor() {
    this.patientCore = new PatientOptimizedCore();
  }

  /**
   * Route patient input through optimized pipeline
   */
  async route(userInput: string): Promise<OptimizedResult> {
    this.sessionMessageCount++;
    
    const context: PatientContext = {
      userInput,
      sessionId: `session_${Date.now()}`,
      messageCount: this.sessionMessageCount,
      isNewSession: this.sessionMessageCount === 1
    };

    console.log(`PATIENT ROUTER: Processing message ${this.sessionMessageCount}`);
    
    const result = await this.patientCore.process(context);
    
    console.log(`PATIENT ROUTER: Completed in ${result.processingTimeMs}ms with quality ${result.therapeuticQuality}`);
    
    return result;
  }

  /**
   * Reset session for new patient
   */
  resetSession(): void {
    this.sessionMessageCount = 0;
  }
}

// Export singleton
export const patientRouter = new PatientRouter();
