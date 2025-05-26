
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

/**
 * Handles eating disorder detection in user messages with crisis audit logging
 * 
 * @param userInput User's original message
 * @param updateStage Function to update conversation stage
 * @returns Eating disorder response message if detected, null otherwise
 */
export const handleEatingDisorderDetection = async (
  userInput: string,
  updateStage: () => void
): Promise<MessageType | null> => {
  if (!userInput || typeof userInput !== 'string') {
    return null;
  }

  // Check for eating disorder specifically to avoid hallucination - SECOND HIGHEST PRIORITY
  const edResult = detectEatingDisorderConcerns(userInput);
  if (edResult.isEatingDisorderConcern) {
    console.log("HIGH PRIORITY: Detected eating disorder indicators with risk level:", edResult.riskLevel);
    // Update stage
    updateStage();
    
    // Get specialized response
    const edResponse = createEatingDisorderResponse(userInput);
    
    if (edResponse) {
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
        rogerResponse: edResponse,
        detectionMethod: 'eating-disorder-detection-system',
        userAgent: navigator.userAgent,
        ipAddress: 'client-side'
      };

      // Log crisis event and send email notification
      await logCrisisEvent(auditEntry);

      // Record to memory systems with crisis tag
      recordToMemorySystems(userInput, edResponse, "CRISIS:EATING-DISORDER");
      
      // Return eating disorder response
      return createMessage(edResponse, 'roger', 'eating-disorder');
    }
  }
  
  return null;
};
