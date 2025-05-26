

/**
 * Enhanced Crisis Detection with Audit Logging and Location Awareness
 */

import { checkForCrisisContent, detectMultipleCrisisTypes, CrisisType } from '../../../chat/crisisDetection';
import { ConcernType } from '../../../../utils/reflection/reflectionTypes';
import { createMessage } from '../../../../utils/messageUtils';
import { MessageType } from '../../../../components/Message';
import { getCrisisResponseWithLocationInquiry } from '../../../../utils/crisis/crisisResponseCoordinator';
import { recordToMemorySystems } from '../memoryHandler';
import { 
  logCrisisEvent, 
  getCurrentSessionId,
  CrisisAuditEntry 
} from '../../../../utils/crisis/crisisAuditLogger';
import { extractLocationFromText } from '../../../../utils/crisis/locationDetection';

/**
 * Enhanced crisis detection with comprehensive audit logging and location awareness
 */
export const handleEnhancedCrisisDetection = async (
  userInput: string,
  updateStage: () => void,
  hasAskedForLocation: boolean = false
): Promise<MessageType | null> => {
  if (!userInput || typeof userInput !== 'string') {
    return null;
  }

  // Extract location information from user input
  const locationInfo = extractLocationFromText(userInput);

  // ENHANCED: MULTI-CRISIS DETECTION with audit logging and location awareness
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
    
    // Get appropriate crisis response with location awareness
    const responseData = getCrisisResponseWithLocationInquiry(
      crisisType, 
      locationInfo, 
      hasAskedForLocation
    );
    
    // Create audit entry
    const auditEntry: CrisisAuditEntry = {
      timestamp: new Date().toISOString(),
      sessionId: getCurrentSessionId(),
      userInput: userInput,
      crisisType: crisisType as string,
      severity: severity,
      rogerResponse: responseData.response,
      detectionMethod: 'multi-crisis-detection-with-location',
      userAgent: navigator.userAgent,
      ipAddress: 'client-side',
      locationInfo: locationInfo || undefined
    };
    
    // Log crisis event and send email notification
    await logCrisisEvent(auditEntry);
    
    try {
      // Record to memory systems with crisis tag
      recordToMemorySystems(userInput, responseData.response, `CRISIS:${String(crisisType).toUpperCase()}`);
    } catch (error) {
      console.error("Error recording to memory systems:", error);
    }
    
    // Return specific crisis response
    return createMessage(responseData.response, 'roger', crisisType as any);
  }

  // SPECIFIC PATTERN DETECTION with individual audit logging and location awareness

  // SUICIDE DETECTION - HIGHEST PRIORITY
  if (/suicid|kill (myself|me)|end (my|this) life|don'?t want to (live|be alive)|take my (own )?life/i.test(userInput.toLowerCase())) {
    console.log("CRITICAL PRIORITY: Detected suicide indicators");
    updateStage();
    
    const responseData = getCrisisResponseWithLocationInquiry('suicide', locationInfo, hasAskedForLocation);
    
    await logCrisisEvent({
      timestamp: new Date().toISOString(),
      sessionId: getCurrentSessionId(),
      userInput: userInput,
      crisisType: 'suicide-direct-detection',
      severity: 'critical',
      rogerResponse: responseData.response,
      detectionMethod: 'regex-pattern-matching-with-location',
      userAgent: navigator.userAgent,
      ipAddress: 'client-side',
      locationInfo: locationInfo || undefined
    });
    
    recordToMemorySystems(userInput, responseData.response, "CRISIS:SUICIDE");
    return createMessage(responseData.response, 'roger', 'crisis');
  }

  // SELF-HARM DETECTION - HIGH PRIORITY
  if (/harm (myself|me)|cut (myself|me)|hurt (myself|me)|self.harm|cutting|self.injur/i.test(userInput.toLowerCase())) {
    console.log("HIGH PRIORITY: Detected self-harm indicators");
    updateStage();
    
    const responseData = getCrisisResponseWithLocationInquiry('self-harm', locationInfo, hasAskedForLocation);
    
    await logCrisisEvent({
      timestamp: new Date().toISOString(),
      sessionId: getCurrentSessionId(),
      userInput: userInput,
      crisisType: 'self-harm',
      severity: 'high',
      rogerResponse: responseData.response,
      detectionMethod: 'self-harm-pattern-detection-with-location',
      userAgent: navigator.userAgent,
      ipAddress: 'client-side',
      locationInfo: locationInfo || undefined
    });
    
    recordToMemorySystems(userInput, responseData.response, "CRISIS:SELF-HARM");
    return createMessage(responseData.response, 'roger', 'crisis');
  }

  // SUBSTANCE ABUSE DETECTION - HIGH PRIORITY
  if (/overdose|addicted|withdrawal|relapse|heroin|cocaine|meth|substance abuse|can't stop (drinking|using)|alcoholic|drug problem/i.test(userInput.toLowerCase())) {
    console.log("HIGH PRIORITY: Detected substance abuse indicators");
    updateStage();
    
    const responseData = getCrisisResponseWithLocationInquiry('substance-use', locationInfo, hasAskedForLocation);
    
    await logCrisisEvent({
      timestamp: new Date().toISOString(),
      sessionId: getCurrentSessionId(),
      userInput: userInput,
      crisisType: 'substance-use',
      severity: 'high',
      rogerResponse: responseData.response,
      detectionMethod: 'substance-abuse-pattern-detection-with-location',
      userAgent: navigator.userAgent,
      ipAddress: 'client-side',
      locationInfo: locationInfo || undefined
    });
    
    recordToMemorySystems(userInput, responseData.response, "CRISIS:SUBSTANCE-USE");
    return createMessage(responseData.response, 'roger', 'crisis');
  }
  
  return null;
};
