
/**
 * Emergency Response Processing
 * 
 * Handles emergency path detection and intervention
 */

import * as emergencyModule from './emergencyPathDetection';
import { SeverityLevel } from './emergencyPathDetection/types';

/**
 * Processes potential emergency situations in responses
 * @param responseText Original response text
 * @param userInput User input that triggered the response
 * @returns Processed response text
 */
export function processEmergency(responseText: string, userInput: string): string {
  try {
    if (emergencyModule.applyEmergencyIntervention) {
      return emergencyModule.applyEmergencyIntervention(responseText, {
        isEmergencyPath: false,
        severity: SeverityLevel.LOW,
        flags: [],
        requiresImmediateIntervention: false
      });
    }
  } catch (error) {
    console.error("Error in processEmergency:", error);
  }
  
  return responseText;
}
