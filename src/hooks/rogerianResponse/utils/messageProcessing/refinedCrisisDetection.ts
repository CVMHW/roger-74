
/**
 * Refined Crisis Detection with Enhanced Severity Assessment
 * 
 * Distinguishes between minor concerns (pet loss, illness) and actual crisis situations
 * with improved accuracy and reduced false positives
 */

import { checkForCrisisContent, detectMultipleCrisisTypes, CrisisType } from '../../../chat/crisisDetection';
import { ConcernType, SeverityLevel } from '../../../../utils/reflection/reflectionTypes';
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
import { 
  handlePhoneNumberCollection,
  extractPhoneNumber 
} from '../../../../utils/crisis/phoneNumberCollection';

// Non-crisis patterns that should NOT trigger crisis response
const NON_CRISIS_PATTERNS = {
  minorIllness: [
    /cold|flu|fever|headache|stomach ache|sore throat|cough|runny nose/i,
    /sick with|feeling under the weather|coming down with/i,
    /minor illness|not feeling well|feeling sick/i
  ],
  petConcerns: [
    /my (dog|cat|pet|bird|fish|hamster) (is sick|died|passed away)/i,
    /pet (loss|death|illness|surgery)/i,
    /vet visit|veterinarian|animal hospital/i,
    /putting (down|to sleep) my (dog|cat|pet)/i
  ],
  minorStressors: [
    /traffic|commute|late for work|running late/i,
    /weather|rain|snow|storm/i,
    /homework|assignment|test anxiety/i,
    /argument with|disagreement with/i
  ],
  normalGrief: [
    /sad about|missing|remembering/i,
    /grief|mourning|funeral/i,
    /anniversary of|birthday of/i
  ]
};

// High-severity crisis indicators that should ALWAYS trigger response
const CRISIS_INDICATORS = {
  suicideImmediate: [
    /kill myself|end my life|take my life|suicide|suicidal/i,
    /don't want to live|want to die|better off dead/i,
    /plan to (die|kill|hurt)/i
  ],
  selfHarmImmediate: [
    /cut myself|harm myself|hurt myself|cutting/i,
    /razor|blade|burn myself/i,
    /self.harm|self.injur/i
  ],
  substanceCrisis: [
    /overdose|od|too many pills/i,
    /can't stop (drinking|using)/i,
    /withdrawal|detox/i
  ],
  eatingCrisis: [
    /haven't eaten in days|starving myself/i,
    /can't stop (eating|binging|purging)/i,
    /throwing up everything|vomiting after meals/i
  ]
};

/**
 * Assess the severity level of user input to determine if crisis intervention is needed
 */
const assessSeverityLevel = (userInput: string): { level: SeverityLevel; reasoning: string } => {
  const lowercaseInput = userInput.toLowerCase();
  
  // Check for non-crisis patterns first
  for (const [category, patterns] of Object.entries(NON_CRISIS_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(lowercaseInput)) {
        return {
          level: 'low',
          reasoning: `Detected ${category} - not crisis level`
        };
      }
    }
  }
  
  // Check for immediate crisis indicators
  for (const [category, patterns] of Object.entries(CRISIS_INDICATORS)) {
    for (const pattern of patterns) {
      if (pattern.test(lowercaseInput)) {
        return {
          level: 'critical',
          reasoning: `Detected ${category} - immediate crisis intervention required`
        };
      }
    }
  }
  
  // Moderate assessment for ambiguous cases
  const moderateIndicators = [
    /feeling hopeless|feeling worthless|no point/i,
    /can't cope|overwhelmed|breaking down/i,
    /thoughts of death|thinking about dying/i
  ];
  
  for (const pattern of moderateIndicators) {
    if (pattern.test(lowercaseInput)) {
      return {
        level: 'high',
        reasoning: 'Potential mental health concern requiring assessment'
      };
    }
  }
  
  return {
    level: 'medium',
    reasoning: 'General concern, monitoring recommended'
  };
};

/**
 * Enhanced crisis detection with improved severity assessment
 */
export const handleRefinedCrisisDetection = async (
  userInput: string,
  updateStage: () => void,
  hasAskedForLocation: boolean = false
): Promise<MessageType | null> => {
  if (!userInput || typeof userInput !== 'string') {
    return null;
  }

  // PRIORITY 1: Check for phone number in crisis context
  const phoneNumber = extractPhoneNumber(userInput);
  if (phoneNumber) {
    console.log("CRISIS PHONE NUMBER: Detected phone number in user input");
    
    // Extract location information
    let locationInfo = extractLocationFromText(userInput);
    if (!locationInfo) {
      try {
        locationInfo = await getBrowserLocation();
      } catch (error) {
        console.log('Could not get browser location:', error);
      }
    }
    
    // Handle phone number collection (this will send email alert)
    const phoneResponse = await handlePhoneNumberCollection(userInput, 'crisis', locationInfo);
    if (phoneResponse) {
      updateStage();
      recordToMemorySystems(userInput, phoneResponse, "CRISIS:PHONE-NUMBER-PROVIDED");
      return createMessage(phoneResponse, 'roger', 'crisis');
    }
  }

  // PRIORITY 2: Assess severity level
  const severityAssessment = assessSeverityLevel(userInput);
  console.log("REFINED CRISIS DETECTION: Severity assessment:", severityAssessment);

  // Only proceed with crisis response for medium, high, or critical levels
  if (severityAssessment.level === 'low') {
    console.log("REFINED CRISIS DETECTION: Non-crisis level detected, skipping crisis response");
    return null;
  }

  // PRIORITY 3: Check for crisis refusal patterns (only for medium+ severity)
  if (severityAssessment.level !== 'low') {
    const refusalResponse = handleCrisisRefusal(userInput);
    if (refusalResponse) {
      return refusalResponse;
    }
  }

  // Extract location information from user input
  let locationInfo = extractLocationFromText(userInput);
  
  // If no location in text, try browser geolocation
  if (!locationInfo) {
    try {
      locationInfo = await getBrowserLocation();
      console.log("REFINED CRISIS: Got browser location:", locationInfo);
    } catch (error) {
      console.log('Could not get browser location:', error);
    }
  }

  // ENHANCED: MULTI-CRISIS DETECTION with refined severity assessment
  const crisisTypes = detectMultipleCrisisTypes(userInput);
  
  if (crisisTypes.length > 0 && severityAssessment.level !== 'low') {
    console.log("REFINED CRISIS DETECTION: Found crisis types:", crisisTypes);
    console.log("REFINED CRISIS DETECTION: Severity level:", severityAssessment.level);
    console.log("REFINED CRISIS DETECTION: Location info:", locationInfo);
    
    // Update stage
    updateStage();
    
    let crisisType = crisisTypes[0];
    let severity = severityAssessment.level;
    
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
    
    console.log("REFINED CRISIS DETECTION: Response data:", responseData);
    
    // Create audit entry with enhanced clinical data
    const auditEntry: CrisisAuditEntry = {
      timestamp: new Date().toISOString(),
      sessionId: getCurrentSessionId(),
      userInput: userInput,
      crisisType: crisisType as string,
      severity: severity,
      rogerResponse: responseData.response,
      detectionMethod: 'refined-multi-crisis-detection-with-severity-assessment',
      userAgent: navigator.userAgent,
      ipAddress: 'client-side',
      locationInfo: locationInfo || undefined,
      clinicalNotes: `${generateClinicalNotes(userInput, crisisType, severity)}. Severity Assessment: ${severityAssessment.reasoning}`,
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

  return null;
};

/**
 * Handle crisis refusal with Roger's personality-driven gentle pushiness and phone number collection
 */
const handleCrisisRefusal = (userInput: string): MessageType | null => {
  const refusalPattern = /(no|not|don't|won't|can't|refuse|not ready|not interested|not going|won't call|won't go).+(help|call|988|hotline|counselor|therapist|hospital|treatment|emily|glenbeigh)/i;
  
  if (refusalPattern.test(userInput)) {
    console.log("CRISIS REFUSAL DETECTED: User refusing resources");
    
    // Track the refusal and get current data
    trackCrisisRefusal(userInput);
    const refusalData = getCrisisRefusalHistory();
    
    // Roger's personality-driven responses with escalating gentle pushiness and phone number requests
    let rogerResponse = "";
    
    if (refusalData && refusalData.refusalCount === 1) {
      // Level 1: Understanding but structured introduction to smaller steps
      rogerResponse = "I hear that you're not ready to reach out to those resources right now, and that's understandable. Sometimes it takes time to feel ready for that step. I tend to notice that when people are struggling, having someone who just listens can be valuable too. At the same time, I'm wondering if there might be smaller steps that could feel more manageable - maybe just learning about what's available, without any commitment to use them right now?";
    } else if (refusalData && refusalData.refusalCount === 2) {
      // Level 2: Roger's detail-oriented nature kicks in with gentle exploration + phone number request
      rogerResponse = "I understand those resources don't feel right for you at this moment. That's okay - sometimes the timing has to feel right. I'm curious though, and forgive me if this seems like I'm being persistent, but I tend to want to understand what specifically feels concerning about reaching out. Is it the idea of talking to someone new, or worrying about what they might say, or something else entirely? Sometimes understanding the 'what' behind the hesitation can help us figure out what might actually feel supportive. Also, would you be comfortable sharing a phone number where someone could reach you if needed? Not for immediate use, just to have that option available.";
    } else if (refusalData && refusalData.refusalCount === 3) {
      // Level 3: Structured Roger with gentle but firmer concern + stronger phone number request
      rogerResponse = "I can see that reaching out for professional help doesn't feel like the right step for you right now, and I've heard you say that a few times now. I respect that, and I want you to know I'm not trying to pressure you. At the same time, I'm sitting here feeling genuinely concerned about you, and I tend to be the kind of person who wants to make sure we've really explored all the options. Would you be willing to help me understand what would need to be different for seeking help to feel okay? And honestly, I'm wondering if you'd consider sharing a phone number - not because you have to call anyone, but because having that direct connection available could be important if things feel different later.";
    } else {
      // Level 4: Roger's authentic concern with maintained boundaries + final phone number request
      rogerResponse = "I hear you, and I've been listening to you tell me several times now that professional resources don't feel right. I want to respect that, and I also want to be honest with you - I'm feeling concerned about you, and that concern isn't going away just because you're not ready for those resources. I tend to be pretty straightforward about things like this, so I'm going to say directly: I care about what happens to you, and I want to keep talking with you about what you're going through. Can we figure out together what kind of support would actually feel helpful to you right now? And would you consider sharing a phone number? I know you've declined resources, but sometimes having that direct connection can make all the difference when someone is ready.";
    }
    
    // Record the refusal and Roger's response
    recordToMemorySystems(userInput, rogerResponse, "CRISIS:REFUSAL");
    
    return createMessage(rogerResponse, 'roger', 'crisis-refusal' as ConcernType);
  }
  
  return null;
};

/**
 * Track crisis refusal with Roger's pushiness level
 */
interface CrisisRefusalData {
  sessionId: string;
  refusalCount: number;
  lastRefusalTime: string;
  crisisType: string;
  refusedResources: string[];
  rogerPushinessLevel: number; // 0-3, escalates based on refusals
}

const trackCrisisRefusal = (userInput: string): void => {
  const sessionId = getCurrentSessionId();
  const existingData = sessionStorage.getItem('crisis_refusal_data');
  
  let refusalData: CrisisRefusalData;
  
  if (existingData) {
    refusalData = JSON.parse(existingData);
    refusalData.refusalCount += 1;
    refusalData.lastRefusalTime = new Date().toISOString();
    refusalData.refusedResources.push(userInput);
    // Escalate Roger's gentle pushiness (max level 3)
    refusalData.rogerPushinessLevel = Math.min(refusalData.refusalCount, 3);
  } else {
    refusalData = {
      sessionId,
      refusalCount: 1,
      lastRefusalTime: new Date().toISOString(),
      crisisType: 'unknown',
      refusedResources: [userInput],
      rogerPushinessLevel: 1
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
