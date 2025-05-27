
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
    
    return await unifiedPipelineRouter.route(userInput, []);
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
