
/**
 * Unified Crisis Processor
 * 
 * Processes crisis detection using standardized types and interfaces
 */

import { CrisisContext, SeverityLevel } from '../core/types';
import { handleRefinedCrisisDetection } from '../../../hooks/rogerianResponse/utils/messageProcessing/refinedCrisisDetection';

/**
 * Process crisis detection with unified types
 */
export const processCrisis = async (
  userInput: string,
  updateStage?: () => void
): Promise<CrisisContext> => {
  console.log("CRISIS PROCESSOR: Checking for crisis indicators");
  
  try {
    if (!updateStage) {
      // Basic crisis detection if no updateStage function
      const crisisPattern = /\b(suicide|kill myself|end it all|can't go on|want to die|harm myself)\b/i;
      const isCrisisDetected = crisisPattern.test(userInput);
      
      return {
        isCrisisDetected,
        crisisType: isCrisisDetected ? 'suicidal-ideation' : undefined,
        severity: isCrisisDetected ? 'critical' : undefined,
        immediateIntervention: isCrisisDetected
      };
    }
    
    // Use refined crisis detection
    const crisisResponse = await handleRefinedCrisisDetection(userInput, updateStage);
    
    if (crisisResponse) {
      console.log("CRISIS PROCESSOR: Crisis detected", crisisResponse.concernType);
      
      const mapSeverity = (concernType: string): SeverityLevel => {
        if (concernType.includes('suicide') || concernType.includes('harm')) return 'critical';
        if (concernType.includes('depression') || concernType.includes('anxiety')) return 'high';
        return 'medium';
      };
      
      return {
        isCrisisDetected: true,
        crisisType: crisisResponse.concernType,
        severity: mapSeverity(crisisResponse.concernType),
        immediateIntervention: true
      };
    }
    
    return {
      isCrisisDetected: false
    };
    
  } catch (error) {
    console.error("CRISIS PROCESSOR: Error in crisis detection:", error);
    return {
      isCrisisDetected: false
    };
  }
};
