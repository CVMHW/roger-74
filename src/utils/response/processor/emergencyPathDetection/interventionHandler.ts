/**
 * Emergency path intervention handler
 */

import { SeverityLevel, EmergencyPathResult, EmergencyType } from './types';
import { hasSharedThatPattern } from '../hallucinationHandler/specialCases';

/**
 * Apply an appropriate intervention for an emergency path
 */
export const applyEmergencyIntervention = (
  responseText: string,
  emergencyPathResult: EmergencyPathResult
): string => {
  // Handle based on severity
  if (emergencyPathResult.severity === SeverityLevel.SEVERE) {
    // Critical emergency - use the most direct intervention
    return getCriticalEmergencyResponse(emergencyPathResult);
  } else if (emergencyPathResult.severity === SeverityLevel.HIGH) {
    // High severity - use serious but less immediate intervention
    return getHighSeverityResponse(emergencyPathResult);
  } else if (emergencyPathResult.severity === SeverityLevel.MEDIUM) {
    // Medium severity - blend original response with intervention
    return blendResponseWithIntervention(responseText, emergencyPathResult);
  } else {
    // Low severity - add gentle guidance to original response
    return addGuidanceToResponse(responseText, emergencyPathResult);
  }
};

/**
 * Get response for critical emergency
 */
function getCriticalEmergencyResponse(result: EmergencyPathResult): string {
  // Critical intervention responses focus on immediate safety and resources
  const responses = [
    "I'm really concerned about what you're sharing. If you're in immediate danger or having thoughts of harming yourself, please call emergency services (911/999/112) right now. It's important that you speak with someone who can help you immediately.",
    "This sounds very serious. If you're thinking about suicide or feeling unsafe, please reach out to a crisis helpline like the National Suicide Prevention Lifeline (1-800-273-8255) right away - they have trained counselors available 24/7. Your safety is the absolute priority right now.",
    "I need to pause our conversation to make sure you're safe. If you're in crisis, please contact emergency services or a crisis line immediately. They're equipped to provide the immediate support you need right now. Would you like me to share some resources that might help?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Get response for high severity
 */
function getHighSeverityResponse(result: EmergencyPathResult): string {
  // High severity responses emphasize getting professional help
  const responses = [
    "What you're describing sounds really difficult, and I think it would be valuable for you to connect with a licensed mental health professional who can provide the support you need. Would it be okay if I shared some resources that might help?",
    "I'm concerned about what you're sharing. These feelings deserve attention from someone professionally trained to help. Have you considered reaching out to a therapist or counselor? They could offer strategies specifically for what you're experiencing.",
    "This sounds like a really challenging situation. While I'm here to listen, a qualified professional would be best equipped to support you through this. Would you like some information about finding mental health resources?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Blend original response with intervention
 */
function blendResponseWithIntervention(response: string, result: EmergencyPathResult): string {
  // Medium severity - add supportive language while keeping original insights
  const interventionPhrases = [
    "I hear you sharing something important. While I'm here to listen, this might also be something worth discussing with a mental health professional who can provide more tailored guidance.",
    "Thank you for sharing this with me. While we can continue talking, these challenges might also benefit from professional support. Have you considered speaking with a counselor?",
    "I appreciate you opening up about this. While we can explore this together, a trained therapist might offer additional perspectives and strategies that could be helpful."
  ];
  
  const intervention = interventionPhrases[Math.floor(Math.random() * interventionPhrases.length)];
  
  // Check if response is short enough to add intervention at beginning
  if (response.length < 200) {
    return intervention + " " + response;
  } else {
    // For longer responses, find a good breaking point
    const sentences = response.split(/(?<=[.!?])\s+/);
    if (sentences.length > 1) {
      const firstPart = sentences.slice(0, Math.ceil(sentences.length / 2)).join(" ");
      const secondPart = sentences.slice(Math.ceil(sentences.length / 2)).join(" ");
      return firstPart + " " + intervention + " " + secondPart;
    } else {
      return intervention + " " + response;
    }
  }
}

/**
 * Add gentle guidance to original response
 */
function addGuidanceToResponse(response: string, result: EmergencyPathResult): string {
  // Low severity - add gentle supportive language at the end
  const guidancePhrases = [
    "Remember that it's okay to reach out for additional support when you need it.",
    "Taking care of your wellbeing is important, and it's always okay to seek help if things feel overwhelming.",
    "While we can talk through this together, professional support is always an option if you feel you'd benefit from it."
  ];
  
  const guidance = guidancePhrases[Math.floor(Math.random() * guidancePhrases.length)];
  
  // Check if response already ends with punctuation
  if (response.match(/[.!?]$/)) {
    return response + " " + guidance;
  } else {
    return response + ". " + guidance;
  }
}
