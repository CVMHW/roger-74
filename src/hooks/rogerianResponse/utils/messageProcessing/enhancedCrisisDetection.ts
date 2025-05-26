
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
 * Enhanced crisis detection with comprehensive audit logging for all crisis types
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
    
    // Prioritize crisis types by severity
    if (crisisTypes.includes('suicide')) {
      crisisType = 'suicide';
      severity = 'critical';
    } else if (crisisTypes.includes('self-harm')) {
      crisisType = 'self-harm';
      severity = 'high';
    } else if (crisisTypes.includes('eating-disorder')) {
      crisisType = 'eating-disorder';
      severity = 'high';
    } else if (crisisTypes.includes('substance-use')) {
      crisisType = 'substance-use';
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
      ipAddress: 'client-side'
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

  // SPECIFIC PATTERN DETECTION with individual audit logging

  // SUICIDE DETECTION - HIGHEST PRIORITY
  if (/suicid|kill (myself|me)|end (my|this) life|don'?t want to (live|be alive)|take my (own )?life/i.test(userInput.toLowerCase())) {
    console.log("CRITICAL PRIORITY: Detected suicide indicators");
    updateStage();
    
    const response = "I'm very concerned about what you're sharing regarding thoughts of suicide. This is serious, and it's important you speak with a crisis professional right away. Please call the 988 Suicide & Crisis Lifeline (call or text 988) immediately, or go to your nearest emergency room. Would you like me to provide additional resources?";
    
    await logCrisisEvent({
      timestamp: new Date().toISOString(),
      sessionId: getCurrentSessionId(),
      userInput: userInput,
      crisisType: 'suicide-direct-detection',
      severity: 'critical',
      rogerResponse: response,
      detectionMethod: 'regex-pattern-matching',
      userAgent: navigator.userAgent,
      ipAddress: 'client-side'
    });
    
    recordToMemorySystems(userInput, response, "CRISIS:SUICIDE");
    return createMessage(response, 'roger', 'crisis');
  }

  // SELF-HARM DETECTION - HIGH PRIORITY
  if (/harm (myself|me)|cut (myself|me)|hurt (myself|me)|self.harm|cutting|self.injur/i.test(userInput.toLowerCase())) {
    console.log("HIGH PRIORITY: Detected self-harm indicators");
    updateStage();
    
    const response = "I'm very concerned about what you're sharing regarding self-harm. Your safety is important, and it would be beneficial to speak with a crisis professional who can provide immediate support. The 988 Suicide & Crisis Lifeline (call or text 988) is available 24/7. Would it be possible for you to reach out to them today?";
    
    await logCrisisEvent({
      timestamp: new Date().toISOString(),
      sessionId: getCurrentSessionId(),
      userInput: userInput,
      crisisType: 'self-harm',
      severity: 'high',
      rogerResponse: response,
      detectionMethod: 'self-harm-pattern-detection',
      userAgent: navigator.userAgent,
      ipAddress: 'client-side'
    });
    
    recordToMemorySystems(userInput, response, "CRISIS:SELF-HARM");
    return createMessage(response, 'roger', 'crisis');
  }

  // SUBSTANCE ABUSE DETECTION - HIGH PRIORITY
  if (/overdose|addicted|withdrawal|relapse|heroin|cocaine|meth|substance abuse|can't stop (drinking|using)|alcoholic|drug problem/i.test(userInput.toLowerCase())) {
    console.log("HIGH PRIORITY: Detected substance abuse indicators");
    updateStage();
    
    const response = "I'm concerned about what you're sharing regarding substance use. This situation sounds serious, and it's important that you speak with a healthcare professional. The SAMHSA National Helpline (1-800-662-4357) provides free, confidential, 24/7 treatment referral and information. Would it help to discuss resources available to you?";
    
    await logCrisisEvent({
      timestamp: new Date().toISOString(),
      sessionId: getCurrentSessionId(),
      userInput: userInput,
      crisisType: 'substance-use',
      severity: 'high',
      rogerResponse: response,
      detectionMethod: 'substance-abuse-pattern-detection',
      userAgent: navigator.userAgent,
      ipAddress: 'client-side'
    });
    
    recordToMemorySystems(userInput, response, "CRISIS:SUBSTANCE-USE");
    return createMessage(response, 'roger', 'crisis');
  }
  
  return null;
};
