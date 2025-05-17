
/**
 * Crisis Response Coordinator
 * 
 * Centralized system for coordinating crisis responses across the application
 * to ensure consistent, appropriate handling of high-risk situations
 */

import { ConcernType } from '../reflection/reflectionTypes';

// Define crisis types
export type CrisisType = 
  | 'suicide' 
  | 'self-harm' 
  | 'eating-disorder'
  | 'substance-use'  // Consistent with ConcernType
  | 'general-crisis';

// Response guidelines for different crisis types
interface CrisisResponseGuidelines {
  initialResponse: string;
  followupResponse: string;
  escalatedResponse: string;
  resources: string[];
}

// Map of crisis response guidelines by type
const crisisGuidelinesMap: Record<CrisisType, CrisisResponseGuidelines> = {
  'suicide': {
    initialResponse: "I'm very concerned about what you're sharing. This is serious, and it's important you speak with a crisis professional right away. Please call the 988 Suicide & Crisis Lifeline (call or text 988) immediately, or go to your nearest emergency room. Would you like me to provide additional resources?",
    followupResponse: "I'm still very concerned about what you're sharing. I want to emphasize how important it is to speak with a crisis professional right away. Please call the 988 Suicide & Crisis Lifeline at 988 now. Would you like me to provide additional resources or support options?",
    escalatedResponse: "I hear your pain and I'm deeply concerned for your safety right now. Please call 988 immediately - even if you've hesitated until now. The crisis counselors there understand what you're going through and can provide immediate support. Your life matters, and help is available right now.",
    resources: [
      "988 Suicide & Crisis Lifeline: Call or text 988",
      "Crisis Text Line: Text HOME to 741741",
      "International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/"
    ]
  },
  'self-harm': {
    initialResponse: "I'm concerned about your thoughts of harming yourself. While these thoughts are distressing, help is available. Please reach out to the 988 Suicide & Crisis Lifeline (call or text 988) to speak with a trained counselor who can provide immediate support.",
    followupResponse: "I want to emphasize how important it is to get support for these thoughts of self-harm. The 988 Suicide & Crisis Lifeline has counselors specifically trained to help with these exact feelings. Would it help to talk about what might be making it difficult to reach out?",
    escalatedResponse: "Your safety is the most important thing right now. Please call 988 or go to your nearest emergency room immediately. Self-harm thoughts can escalate quickly, and professional support is crucial right now.",
    resources: [
      "988 Suicide & Crisis Lifeline: Call or text 988",
      "Crisis Text Line: Text HOME to 741741",
      "Self-Injury Foundation: www.selfinjuryfoundation.org"
    ]
  },
  'eating-disorder': {
    initialResponse: "I'm concerned about what you're sharing regarding your eating patterns. This sounds serious, and it's important that you speak with a healthcare professional. The National Eating Disorders Association (NEDA) helpline (1-800-931-2237) can provide immediate support and resources. Would it be possible for you to reach out to them today?",
    followupResponse: "I'm still concerned about your eating patterns. The National Eating Disorders Association has professionals who understand what you're going through. Please reach out to their helpline at 1-800-931-2237. Would you be willing to call them today?",
    escalatedResponse: "Your continued struggle with eating is serious, and professional help is essential. The NEDA helpline at 1-800-931-2237 can connect you with treatment options tailored to your needs. You deserve support during this difficult time.",
    resources: [
      "National Eating Disorders Association (NEDA): 1-800-931-2237",
      "NEDA Crisis Text Line: Text 'NEDA' to 741741",
      "Eating Disorders Anonymous: www.eatingdisordersanonymous.org"
    ]
  },
  'substance-use': {  // Consistent with ConcernType
    initialResponse: "I'm concerned about what you're sharing regarding your drinking. This sounds serious, and it's important that you speak with a healthcare professional. The SAMHSA National Helpline (1-800-662-4357) provides free, confidential, 24/7 treatment referral and information. Would it help to discuss resources available to you?",
    followupResponse: "I understand your struggle with drinking is serious. The SAMHSA National Helpline at 1-800-662-4357 provides confidential support and can connect you with local resources. They're available 24/7. Would you consider calling them?",
    escalatedResponse: "Your continued struggle with alcohol is concerning. Please know that recovery is possible with the right support. The SAMHSA helpline at 1-800-662-4357 can help you find treatment options that work for your situation. You don't have to face this alone.",
    resources: [
      "SAMHSA National Helpline: 1-800-662-4357",
      "Alcoholics Anonymous: www.aa.org",
      "National Drug Helpline: 1-844-289-0879"
    ]
  },
  'general-crisis': {
    initialResponse: "I can tell you're going through an extremely difficult time right now. It's important to connect with professional support who can help you navigate this crisis. Please reach out to a crisis line for immediate support.",
    followupResponse: "I'm still concerned about what you're sharing. Speaking with a professional who can provide appropriate support would be helpful. The 988 Lifeline (call or text 988) connects you with trained counselors. Would you be willing to reach out to them?",
    escalatedResponse: "I continue to hear your distress, and I want to emphasize that professional help is available. Please consider calling 988 or visiting your local emergency services where professionals can provide the support you need right now.",
    resources: [
      "988 Suicide & Crisis Lifeline: Call or text 988",
      "Crisis Text Line: Text HOME to 741741",
      "SAMHSA National Helpline: 1-800-662-4357"
    ]
  }
};

/**
 * Get appropriate crisis response based on type and escalation level
 * If multiple crisis types are provided, suicide takes highest priority
 */
export const getCrisisResponse = (
  crisisType: CrisisType | ConcernType | string[],
  escalationLevel: 'initial' | 'followup' | 'escalated' = 'initial'
): string => {
  // Handle multiple crisis types (array input)
  if (Array.isArray(crisisType)) {
    // Check for suicide first (highest priority)
    if (crisisType.includes('suicide')) {
      return getCrisisResponse('suicide', escalationLevel);
    }
    // Then self-harm
    if (crisisType.includes('self-harm')) {
      return getCrisisResponse('self-harm', escalationLevel); 
    }
    // Then eating disorders
    if (crisisType.includes('eating-disorder')) {
      return getCrisisResponse('eating-disorder', escalationLevel);
    }
    // Then substance use
    if (crisisType.includes('substance-use')) {
      return getCrisisResponse('substance-use', escalationLevel);
    }
    // If none of the specific types match, use the first type
    if (crisisType.length > 0) {
      return getCrisisResponse(crisisType[0], escalationLevel);
    }
    // Fallback to general crisis
    return getCrisisResponse('general-crisis', escalationLevel);
  }
  
  // Map Roger's concern types to our crisis types
  const mappedType = mapConcernToCrisisType(crisisType as string);
  
  // Get guidelines for this crisis type
  const guidelines = crisisGuidelinesMap[mappedType] || crisisGuidelinesMap['general-crisis'];
  
  // Return appropriate response based on escalation level
  switch (escalationLevel) {
    case 'followup':
      return guidelines.followupResponse;
    case 'escalated':
      return guidelines.escalatedResponse;
    case 'initial':
    default:
      return guidelines.initialResponse;
  }
};

/**
 * Get resources for a specific crisis type
 * If multiple crisis types are provided, return resources for all
 */
export const getCrisisResources = (crisisType: CrisisType | ConcernType | string[]): string[] => {
  // Handle multiple crisis types
  if (Array.isArray(crisisType)) {
    // Collect resources for all crisis types
    const allResources: string[] = [];
    
    // Always include suicide resources first if present
    if (crisisType.includes('suicide')) {
      allResources.push(...getCrisisResources('suicide'));
    }
    
    // Include resources for all other crisis types
    crisisType.forEach(type => {
      if (type !== 'suicide') { // Skip suicide since we already included it
        const resources = getCrisisResources(type);
        resources.forEach(resource => {
          if (!allResources.includes(resource)) {
            allResources.push(resource);
          }
        });
      }
    });
    
    return allResources;
  }
  
  // Single crisis type
  const mappedType = mapConcernToCrisisType(crisisType as string);
  return (crisisGuidelinesMap[mappedType] || crisisGuidelinesMap['general-crisis']).resources;
};

/**
 * Detect crisis type from user input
 * Returns array of all detected crisis types to handle multiple issues
 */
export const detectCrisisTypeFromInput = (userInput: string): CrisisType[] | null => {
  const lowerInput = userInput.toLowerCase();
  const detectedTypes: CrisisType[] = [];
  
  // Check for suicide/self-harm indicators - HIGHEST PRIORITY
  if (/suicid|kill (myself|me)|end (my|this) life|want to die|shoot myself/i.test(lowerInput)) {
    detectedTypes.push('suicide');
  }
  
  // Check for self-harm (without explicit suicide mention)
  if (/harm (myself|me)|cut (myself|me)|hurt (myself|me)/i.test(lowerInput) && !detectedTypes.includes('suicide')) {
    detectedTypes.push('self-harm');
  }
  
  // Check for eating disorder indicators
  if (/can't stop eating|binge eating|overeating|eating too much|not eating|haven'?t been eating|purge|anorexia|bulimia/i.test(lowerInput)) {
    detectedTypes.push('eating-disorder');
  }
  
  // Check for substance abuse indicators
  if (/drinking|drunk|alcohol|can't stop drinking|addicted/i.test(lowerInput)) {
    detectedTypes.push('substance-use');
  }
  
  return detectedTypes.length > 0 ? detectedTypes : null;
};

/**
 * Map Roger's concern types to our crisis types
 */
function mapConcernToCrisisType(concernType: string): CrisisType {
  switch (concernType) {
    case 'suicide':
    case 'crisis':
      return 'suicide';
    case 'tentative-harm':
    case 'self-harm':
      return 'self-harm';
    case 'eating-disorder':
      return 'eating-disorder';
    case 'substance-use':  // Consistent with ConcernType
      return 'substance-use'; 
    default:
      return 'general-crisis';
  }
}

/**
 * Determine if a response needs to be coordinated as a crisis response
 */
export const requiresCrisisCoordination = (userInput: string): boolean => {
  return detectCrisisTypeFromInput(userInput) !== null;
};

/**
 * Multi-crisis handler for complex situations
 * Returns appropriate response when multiple crises are detected
 */
export const handleMultipleCrises = (userInput: string): string | null => {
  const crisisTypes = detectCrisisTypeFromInput(userInput);
  
  if (!crisisTypes || crisisTypes.length === 0) {
    return null;
  }
  
  // For multiple crisis types, prioritize suicide/self-harm
  if (crisisTypes.length > 1) {
    console.log("CRISIS COORDINATOR: Multiple crisis types detected:", crisisTypes);
    
    // If suicide is present, it takes absolute priority
    if (crisisTypes.includes('suicide')) {
      return getCrisisResponse('suicide');
    }
    
    // Next priority is self-harm
    if (crisisTypes.includes('self-harm')) {
      return getCrisisResponse('self-harm');
    }
    
    // If we have both eating disorders and substance use, create a combined response
    if (crisisTypes.includes('eating-disorder') && crisisTypes.includes('substance-use')) {
      return "I'm very concerned about what you're sharing regarding both your eating patterns and substance use. These issues can be serious, especially when occurring together. It's important that you speak with healthcare professionals who can provide appropriate support. The SAMHSA National Helpline (1-800-662-4357) can help with both substance use and connect you to eating disorder resources. Would it be possible for you to reach out to them today?";
    }
  }
  
  // For single crisis type or if no special handling above, use standard response
  return getCrisisResponse(crisisTypes);
};
