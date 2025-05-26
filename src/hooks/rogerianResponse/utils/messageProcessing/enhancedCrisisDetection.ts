/**
 * Enhanced Crisis Detection with Audit Logging, Location Awareness, and Refusal Handling
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
import { extractLocationFromText, getBrowserLocation } from '../../../../utils/crisis/locationDetection';

// Track crisis refusal patterns in session storage
interface CrisisRefusalData {
  sessionId: string;
  refusalCount: number;
  lastRefusalTime: string;
  crisisType: string;
  refusedResources: string[];
}

/**
 * Enhanced crisis detection with refusal tracking and Roger's gentle persistence
 */
export const handleEnhancedCrisisDetection = async (
  userInput: string,
  updateStage: () => void,
  hasAskedForLocation: boolean = false
): Promise<MessageType | null> => {
  if (!userInput || typeof userInput !== 'string') {
    return null;
  }

  // Check for crisis refusal patterns first
  const refusalResponse = handleCrisisRefusal(userInput);
  if (refusalResponse) {
    return refusalResponse;
  }

  // Extract location information from user input
  let locationInfo = extractLocationFromText(userInput);
  
  // If no location in text, try browser geolocation
  if (!locationInfo) {
    try {
      locationInfo = await getBrowserLocation();
      console.log("ENHANCED CRISIS: Got browser location:", locationInfo);
    } catch (error) {
      console.log('Could not get browser location:', error);
    }
  }

  // ENHANCED: MULTI-CRISIS DETECTION with audit logging and location awareness
  const crisisTypes = detectMultipleCrisisTypes(userInput);
  
  if (crisisTypes.length > 0) {
    console.log("ENHANCED CRISIS DETECTION: Found crisis types:", crisisTypes);
    console.log("ENHANCED CRISIS DETECTION: Location info:", locationInfo);
    
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
    
    console.log("ENHANCED CRISIS DETECTION: Response data:", responseData);
    
    // Create audit entry with enhanced clinical data
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
      locationInfo: locationInfo || undefined,
      clinicalNotes: generateClinicalNotes(userInput, crisisType, severity),
      riskAssessment: assessRiskLevel(userInput, crisisType),
      refusalHistory: getCrisisRefusalHistory()
    };
    
    // Log crisis event and send enhanced email notification
    await logCrisisEvent(auditEntry);
    
    try {
      // Record to memory systems with crisis tag
      recordToMemorySystems(userInput, responseData.response, `CRISIS:${String(crisisType).toUpperCase()}`);
    } catch (error) {
      console.error("Error recording to memory systems:", error);
    }
    
    // Return specific crisis response with location-enhanced content
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
      locationInfo: locationInfo || undefined,
      clinicalNotes: generateClinicalNotes(userInput, 'suicide', 'critical'),
      riskAssessment: assessRiskLevel(userInput, 'suicide'),
      refusalHistory: getCrisisRefusalHistory()
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
      locationInfo: locationInfo || undefined,
      clinicalNotes: generateClinicalNotes(userInput, 'self-harm', 'high'),
      riskAssessment: assessRiskLevel(userInput, 'self-harm'),
      refusalHistory: getCrisisRefusalHistory()
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
      locationInfo: locationInfo || undefined,
      clinicalNotes: generateClinicalNotes(userInput, 'substance-use', 'high'),
      riskAssessment: assessRiskLevel(userInput, 'substance-use'),
      refusalHistory: getCrisisRefusalHistory()
    });
    
    recordToMemorySystems(userInput, responseData.response, "CRISIS:SUBSTANCE-USE");
    return createMessage(responseData.response, 'roger', 'crisis');
  }
  
  return null;
};

/**
 * Handle crisis refusal with Roger's gentle persistence approach
 */
const handleCrisisRefusal = (userInput: string): MessageType | null => {
  const refusalPattern = /(no|not|don't|won't|can't|refuse|not ready|not interested|not going|won't call|won't go).+(help|call|988|hotline|counselor|therapist|hospital|treatment|emily|glenbeigh)/i;
  
  if (refusalPattern.test(userInput)) {
    console.log("CRISIS REFUSAL DETECTED: User refusing resources");
    
    // Track the refusal
    trackCrisisRefusal(userInput);
    
    // Get current refusal data
    const refusalData = getCrisisRefusalHistory();
    
    // Roger's gentle persistence response based on refusal count
    let rogerResponse = "";
    
    if (refusalData.refusalCount === 1) {
      rogerResponse = "I hear that you're not ready to reach out to those resources right now, and that's understandable. Sometimes it takes time to feel ready for that step. I tend to notice that when people are struggling, having someone who just listens can be valuable too. I'm here to keep talking with you about whatever feels important right now.";
    } else if (refusalData.refusalCount === 2) {
      rogerResponse = "I understand those resources don't feel right for you at this moment. That's okay - sometimes the timing has to feel right. I'm curious about what would feel most helpful to you right now, even if it's just having someone to talk through what you're experiencing.";
    } else {
      rogerResponse = "I can see that reaching out for professional help doesn't feel like the right step for you right now. I respect that. Sometimes just talking through things with someone who's listening can be a starting point. What feels most overwhelming to you at this moment?";
    }
    
    // Record the refusal and Roger's response
    recordToMemorySystems(userInput, rogerResponse, "CRISIS:REFUSAL");
    
    return createMessage(rogerResponse, 'roger', 'crisis-refusal');
  }
  
  return null;
};

/**
 * Track crisis refusal in session storage
 */
const trackCrisisRefusal = (userInput: string): void => {
  const sessionId = getCurrentSessionId();
  const existingData = sessionStorage.getItem('crisis_refusal_data');
  
  let refusalData: CrisisRefusalData;
  
  if (existingData) {
    refusalData = JSON.parse(existingData);
    refusalData.refusalCount += 1;
    refusalData.lastRefusalTime = new Date().toISOString();
    refusalData.refusedResources.push(userInput);
  } else {
    refusalData = {
      sessionId,
      refusalCount: 1,
      lastRefusalTime: new Date().toISOString(),
      crisisType: 'unknown',
      refusedResources: [userInput]
    };
  }
  
  sessionStorage.setItem('crisis_refusal_data', JSON.stringify(refusalData));
};

/**
 * Get crisis refusal history for current session
 */
const getCrisisRefusalHistory = (): CrisisRefusalData | null => {
  const existingData = sessionStorage.getItem('crisis_refusal_data');
  return existingData ? JSON.parse(existingData) : null;
};

/**
 * Generate clinical notes for email notification
 */
const generateClinicalNotes = (userInput: string, crisisType: string, severity: string): string => {
  const notes = [];
  
  // Risk indicators
  if (/plan|method|means|how to|when to/.test(userInput.toLowerCase())) {
    notes.push("ALERT: Patient may have specific plan/method/means");
  }
  
  if (/tonight|today|soon|now|ready/.test(userInput.toLowerCase())) {
    notes.push("ALERT: Temporal immediacy indicators present");
  }
  
  if (/alone|no one|nobody|isolated/.test(userInput.toLowerCase())) {
    notes.push("Risk factor: Social isolation mentioned");
  }
  
  if (/family|kids|children|responsibility/.test(userInput.toLowerCase())) {
    notes.push("Protective factor: Family/responsibility mentioned");
  }
  
  return notes.length > 0 ? notes.join('; ') : 'Standard crisis presentation';
};

/**
 * Assess risk level based on content analysis
 */
const assessRiskLevel = (userInput: string, crisisType: string): string => {
  let riskScore = 0;
  
  // High risk indicators
  if (/plan|method|means/.test(userInput.toLowerCase())) riskScore += 3;
  if (/tonight|today|soon|now/.test(userInput.toLowerCase())) riskScore += 2;
  if (/alone|no one|nobody/.test(userInput.toLowerCase())) riskScore += 2;
  if (/hopeless|worthless|burden|better off/.test(userInput.toLowerCase())) riskScore += 2;
  
  // Protective factors (reduce risk)
  if (/family|kids|children|pet|job/.test(userInput.toLowerCase())) riskScore -= 1;
  if (/help|support|therapy|counseling/.test(userInput.toLowerCase())) riskScore -= 1;
  
  if (riskScore >= 5) return 'HIGH RISK - Immediate intervention required';
  if (riskScore >= 3) return 'MODERATE RISK - Close monitoring needed';
  if (riskScore >= 1) return 'ELEVATED RISK - Follow-up recommended';
  return 'BASELINE RISK - Standard crisis protocols';
};
