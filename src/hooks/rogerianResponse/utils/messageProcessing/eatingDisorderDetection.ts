

import { detectEatingDisorderConcerns } from '../../../../utils/conversation/specializedDetection/eatingPatterns/detectors';
import { createEatingDisorderResponse } from '../../../../utils/response/handlers/eatingDisorderHandler';
import { createMessage } from '../../../../utils/messageUtils';
import { MessageType } from '../../../../components/Message';
import { recordToMemorySystems } from '../memoryHandler';
import { 
  logCrisisEvent, 
  getCurrentSessionId,
  CrisisAuditEntry 
} from '../../../../utils/crisis/crisisAuditLogger';
import { getCrisisResponseWithLocationInquiry } from '../../../../utils/crisis/crisisResponseCoordinator';
import { extractLocationFromText } from '../../../../utils/crisis/locationDetection';

/**
 * Handles eating disorder detection in user messages with crisis audit logging and location awareness
 * 
 * @param userInput User's original message
 * @param updateStage Function to update conversation stage
 * @param hasAskedForLocation Whether location has been previously requested
 * @returns Eating disorder response message if detected, null otherwise
 */
export const handleEatingDisorderDetection = async (
  userInput: string,
  updateStage: () => void,
  hasAskedForLocation: boolean = false
): Promise<MessageType | null> => {
  if (!userInput || typeof userInput !== 'string') {
    return null;
  }

  // Extract location information from user input
  const locationInfo = extractLocationFromText(userInput);

  // Check for eating disorder specifically to avoid hallucination - SECOND HIGHEST PRIORITY
  const edResult = detectEatingDisorderConcerns(userInput);
  if (edResult.isEatingDisorderConcern) {
    console.log("HIGH PRIORITY: Detected eating disorder indicators with risk level:", edResult.riskLevel);
    // Update stage
    updateStage();
    
    // Get location-aware response
    const responseData = getCrisisResponseWithLocationInquiry(
      'eating-disorder', 
      locationInfo, 
      hasAskedForLocation
    );
    
    if (responseData.response) {
      // Determine severity based on risk level
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
      if (edResult.riskLevel === 'high') {
        severity = 'high';
      } else if (edResult.riskLevel === 'low') {
        severity = 'low';
      }

      // Create audit entry for eating disorder crisis
      const auditEntry: CrisisAuditEntry = {
        timestamp: new Date().toISOString(),
        sessionId: getCurrentSessionId(),
        userInput: userInput,
        crisisType: 'eating-disorder',
        severity: severity,
        rogerResponse: responseData.response,
        detectionMethod: 'eating-disorder-detection-system-with-location',
        userAgent: navigator.userAgent,
        ipAddress: 'client-side',
        locationInfo: locationInfo || undefined
      };

      // Log crisis event and send email notification
      await logCrisisEvent(auditEntry);

      // Record to memory systems with crisis tag
      recordToMemorySystems(userInput, responseData.response, "CRISIS:EATING-DISORDER");
      
      // Return eating disorder response
      return createMessage(responseData.response, 'roger', 'eating-disorder');
    }
  }
  
  return null;
};
