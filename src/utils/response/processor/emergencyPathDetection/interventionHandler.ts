
/**
 * Emergency Path Intervention Handler
 * 
 * Provides interventions for various detected emergency paths
 */

import { EmergencyPathDetectionResult } from './types';
import { SeverityLevel, EmergencyType } from './types';
import { hasSharedThatPattern } from '../hallucinationHandler/specialCases';

/**
 * Apply appropriate intervention based on emergency path detection
 */
export const applyEmergencyIntervention = (
  responseText: string,
  emergencyPathResult: EmergencyPathDetectionResult
): string => {
  // For critical emergencies, use a completely different response
  if (emergencyPathResult.severity === SeverityLevel.SEVERE) {
    return getSevereInterventionResponse(emergencyPathResult.primaryType);
  }
  
  // For moderate emergencies, modify the existing response
  if (emergencyPathResult.severity === SeverityLevel.MODERATE) {
    return getModerateInterventionResponse(responseText, emergencyPathResult.primaryType);
  }
  
  // For mild emergencies, add safety information
  return getMildInterventionResponse(responseText, emergencyPathResult.primaryType);
};

/**
 * Get intervention response for severe emergencies
 */
const getSevereInterventionResponse = (emergencyType: EmergencyType): string => {
  switch (emergencyType) {
    case EmergencyType.SUICIDE_RISK:
      return "I appreciate your courage in sharing something so important. Your safety is the top priority right now. It would be best to speak with someone trained to help in these situations. Would you be willing to call 988 (Suicide & Crisis Lifeline) right now or text HOME to 741741 to reach the Crisis Text Line? They're available 24/7 and can provide immediate support.";
      
    case EmergencyType.DANGER_TO_OTHERS:
      return "I hear that you're experiencing some intense thoughts and feelings right now. It's important to make sure everyone stays safe, including you and those around you. Could you connect with a mental health professional right away? The Crisis Text Line (text HOME to 741741) or calling 988 can provide immediate guidance and support.";
      
    case EmergencyType.ABUSE_VICTIM:
      return "What you're going through sounds very difficult, and no one deserves to be treated that way. Your safety is the most important thing right now. There are resources specifically designed to help in situations like this. The National Domestic Violence Hotline (1-800-799-7233) has trained advocates available 24/7 who can talk through your options confidentially.";
      
    default:
      return "I'm concerned about what you're sharing. This sounds like a situation where speaking with a trained professional would be really beneficial right now. Would you be willing to reach out to the Crisis Text Line (text HOME to 741741) or call 988 for immediate support from someone specially trained to help with these kinds of situations?";
  }
};

/**
 * Get intervention response for moderate emergencies
 */
const getModerateInterventionResponse = (
  responseText: string,
  emergencyType: EmergencyType
): string => {
  let safetyAddendum = "";
  
  switch (emergencyType) {
    case EmergencyType.SUICIDE_RISK:
      safetyAddendum = "I want to make sure you stay safe. The National Suicide Prevention Lifeline (988) is available 24/7 if you ever need someone to talk to about these feelings.";
      break;
      
    case EmergencyType.DANGER_TO_OTHERS:
      safetyAddendum = "These feelings can be overwhelming. Speaking with a mental health professional could really help provide some perspective and strategies. Would you consider reaching out to a counselor?";
      break;
      
    case EmergencyType.ABUSE_VICTIM:
      safetyAddendum = "Your safety is really important. The National Domestic Violence Hotline (1-800-799-7233) has resources that might be helpful if you ever need them.";
      break;
      
    default:
      safetyAddendum = "This sounds challenging. Have you considered speaking with a mental health professional who specializes in these situations?";
  }
  
  return responseText + " " + safetyAddendum;
};

/**
 * Get intervention response for mild emergencies
 */
const getMildInterventionResponse = (
  responseText: string,
  emergencyType: EmergencyType
): string => {
  // For mild emergencies, just add a gentle resource mention
  return responseText + " If you ever need additional support, remember there are resources like the Crisis Text Line (text HOME to 741741) available 24/7.";
};
