
/**
 * Emergency Intervention Handler
 * 
 * Applies interventions when dangerous response patterns are detected
 */

import { SeverityLevel, EmergencyPathResult } from './types';
import { categorizeFlags } from './pathDetector';

/**
 * Intervention templates for different severity levels
 * These provide more spontaneous and direct responses to break out of problematic patterns
 */
const INTERVENTION_TEMPLATES = {
  // For severe cases, completely reset the conversation flow
  [SeverityLevel.SEVERE]: [
    "I want to focus on what you're sharing. Could you tell me more about what happened at the bar?",
    "Let's take a step back. What about this situation has been most challenging for you?",
    "I'd like to understand your experience better. What feelings came up for you during this interaction?",
    "I'm listening. What part of this experience would be most helpful to explore together?",
    "I'm here to support you. What would feel most helpful to talk about right now?"
  ],
  
  // For high severity cases, redirect with more structure
  [SeverityLevel.HIGH]: [
    "That sounds like a frustrating experience. How did you feel after you left the bar?",
    "Social situations like that can be challenging. What thoughts were going through your mind?",
    "I'm curious about how this experience has affected you. What's been on your mind since then?",
    "It sounds like you're reflecting on how you handled the situation. What would you have preferred to do differently?",
    "Those moments can definitely be uncomfortable. How has this been impacting you?"
  ],
  
  // For medium severity cases, gentle course correction
  [SeverityLevel.MEDIUM]: [
    "I hear that this social interaction didn't go as you hoped. Could you share more about what happened?",
    "That kind of embarrassing moment can really stick with us. What's been most on your mind about it?",
    "It sounds like you wish you had responded differently. What would your ideal response have been?",
    "Social awkwardness can be really tough. How have you been processing this experience?",
    "Thank you for sharing that experience. What aspect of it would be most helpful to explore?"
  ],
  
  // For low severity cases, minimal intervention
  [SeverityLevel.LOW]: []
};

/**
 * Apply emergency intervention to redirect the conversation
 * based on the detected emergency path
 */
export const applyEmergencyIntervention = (
  originalResponse: string,
  emergencyPathResult: EmergencyPathResult,
  userInput: string
): string => {
  if (!emergencyPathResult.isEmergencyPath) {
    return originalResponse;
  }
  
  const { severity, flags } = emergencyPathResult;
  const categorizedFlags = categorizeFlags(flags);
  
  console.log(`EMERGENCY INTERVENTION: Applying ${severity} intervention`);
  console.log(`Flag categories:`, 
    Object.entries(categorizedFlags)
      .filter(([_, flags]) => flags.length > 0)
      .map(([category, flags]) => `${category}: ${flags.length}`)
  );
  
  // For severe cases, always use a template to completely reset
  if (severity === SeverityLevel.SEVERE) {
    const templates = INTERVENTION_TEMPLATES[SeverityLevel.SEVERE];
    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
  }
  
  // For high severity, use templates but possibly incorporate user context
  if (severity === SeverityLevel.HIGH) {
    const templates = INTERVENTION_TEMPLATES[SeverityLevel.HIGH];
    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
  }
  
  // For medium severity, use a template that's contextually appropriate
  if (severity === SeverityLevel.MEDIUM) {
    const templates = INTERVENTION_TEMPLATES[SeverityLevel.MEDIUM];
    const randomIndex = Math.floor(Math.random() * templates.length);
    
    // Check if there are specific topics we should acknowledge
    if (userInput.toLowerCase().includes("bar") || userInput.toLowerCase().includes("drink")) {
      if (userInput.toLowerCase().includes("girl") || userInput.toLowerCase().includes("date")) {
        return "Social interactions can be nerve-wracking, especially when we're interested in someone. What do you think made this situation particularly challenging for you?";
      }
      return "That sounds like an uncomfortable moment at the bar. What's been on your mind about it since then?";
    }
    
    return templates[randomIndex];
  }
  
  // For low severity, just return the original
  return originalResponse;
};
