
/**
 * Enhanced Crisis Detection with Audit Logging
 */

import { checkForCrisisContent, detectMultipleCrisisTypes, CrisisType } from '../../../chat/crisisDetection';
import { ConcernType } from '../../../../utils/reflection/reflectionTypes';
import { createMessage } from '../../../../utils/messageUtils';
import { MessageType } from '../../../../components/Message';
import { getCrisisResponse } from '../../../../utils/crisis/crisisResponseCoordinator';
import { recordToMemorySystems } from '../memoryHandler';
import { 
  logCrisisEvent, 
  getCurrentSessionId,
  CrisisAuditEntry 
} from '../../../../utils/crisis/crisisAuditLogger';

/**
 * Enhanced crisis detection with comprehensive audit logging
 */
export const handleEnhancedCrisisDetection = async (
  userInput: string,
  updateStage: () => void
): Promise<MessageType | null> => {
  if (!userInput || typeof userInput !== 'string') {
    return null;
  }

  // ENHANCED: MULTI-CRISIS DETECTION with audit logging
  const crisisTypes = detectMultipleCrisisTypes(userInput);
  
  if (crisisTypes.length > 0) {
    console.log("ENHANCED CRISIS DETECTION: Found crisis types:", crisisTypes);
    
    // Update stage
    updateStage();
    
    let crisisType = crisisTypes[0];
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    
    // Always prioritize suicide if it's one of the detected types
    if (crisisTypes.includes('suicide')) {
      crisisType = 'suicide';
      severity = 'critical';
    } else if (crisisTypes.includes('self-harm')) {
      severity = 'high';
    }
    
    // Get appropriate crisis response from coordinator
    const response = getCrisisResponse(crisisType);
    
    // Create audit entry
    const auditEntry: CrisisAuditEntry = {
      timestamp: new Date().toISOString(),
      sessionId: getCurrentSessionId(),
      userInput: userInput,
      crisisType: crisisType as string,
      severity: severity,
      rogerResponse: response,
      detectionMethod: 'multi-crisis-detection',
      userAgent: navigator.userAgent,
      ipAddress: 'client-side' // Would need server-side for real IP
    };
    
    // Log crisis event and send email notification
    await logCrisisEvent(auditEntry);
    
    try {
      // Record to memory systems with crisis tag
      recordToMemorySystems(userInput, response, `CRISIS:${String(crisisType).toUpperCase()}`);
    } catch (error) {
      console.error("Error recording to memory systems:", error);
    }
    
    // Return specific crisis response
    return createMessage(response, 'roger', crisisType as any);
  }
  
  // CRISIS DETECTION - HIGHEST PRIORITY with audit logging
  if (/suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)|don'?t want to (live|be alive)|take my (own )?life/i.test(userInput.toLowerCase())) {
    console.log("CRITICAL PRIORITY: Detected suicide or self-harm indicators");
    
    // Update stage
    updateStage();
    
    // Use crisis response
    const response = "I'm very concerned about what you're sharing regarding thoughts of suicide or self-harm. This is serious, and it's important you speak with a crisis professional right away. Please call the 988 Suicide & Crisis Lifeline (call or text 988) immediately, or go to your nearest emergency room. Would you like me to provide additional resources?";
    
    // Create audit entry for direct suicide detection
    const auditEntry: CrisisAuditEntry = {
      timestamp: new Date().toISOString(),
      sessionId: getCurrentSessionId(),
      userInput: userInput,
      crisisType: 'suicide-direct-detection',
      severity: 'critical',
      rogerResponse: response,
      detectionMethod: 'regex-pattern-matching',
      userAgent: navigator.userAgent,
      ipAddress: 'client-side'
    };
    
    // Log crisis event and send email notification
    await logCrisisEvent(auditEntry);
    
    try {
      // Record to memory systems with crisis tag
      recordToMemorySystems(userInput, response, "CRISIS:SUICIDE");
    } catch (error) {
      console.error("Error recording to memory systems:", error);
    }
    
    // Return immediate crisis response
    return createMessage(response, 'roger', 'crisis');
  }
  
  return null;
};
