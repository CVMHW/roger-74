
/**
 * Utilities for safety and patient-centered support
 * Implements the unconditional rule about deescalation and customer-centric care
 */

import { ConcernType, SeverityLevel } from './reflection/reflectionTypes';
import { TraumaResponseAnalysis } from './reflection/reflectionTypes';

// Enhanced de-escalation strategies for safety concerns
export const getDeescalationApproaches = (concernType: ConcernType): string[] => {
  const commonApproaches = [
    "Stay present with the individual while acknowledging the seriousness",
    "Use a calm, reassuring tone throughout the interaction",
    "Validate their experience without minimizing concerns",
    "Offer clear next steps that prioritize both support and safety",
    "Balance professional guidance with continued personal support"
  ];
  
  // Add concern-specific approaches
  switch (concernType) {
    case 'crisis':
      return [
        ...commonApproaches,
        "Acknowledge the courage it takes to share these thoughts",
        "Emphasize that help is available and effective",
        "Create a sense of hope while validating current distress",
        "Make concrete suggestions for immediate next steps",
        "Balance urgency with maintaining rapport and trust"
      ];
    case 'tentative-harm':
      return [
        ...commonApproaches,
        "Emphasize that these thoughts don't define them",
        "Acknowledge the distress without focusing exclusively on risk",
        "Remind them that many people experience these thoughts and recover",
        "Encourage small immediate actions to increase safety",
        "Create a sense of partnership in navigating this challenge"
      ];
    case 'substance-use':
      return [
        ...commonApproaches,
        "Acknowledge the complex relationship many have with substances",
        "Validate their insights into their own use patterns",
        "Focus on harm reduction alongside potential resources",
        "Emphasize autonomy in deciding next steps",
        "Recognize the spectrum of substance use concerns"
      ];
    default:
      return commonApproaches;
  }
};

// Function to adapt tone and approach for culturally diverse or high-status clients
// Implements the unconditional rule about customer service and adaptability
export const adaptToneForClientPreference = (
  baseResponse: string, 
  clientContext: {
    prefersFormalLanguage?: boolean;
    prefersDirectApproach?: boolean;
    isFirstTimeWithMentalHealth?: boolean;
    culturalConsiderations?: string[];
  }
): string => {
  let adaptedResponse = baseResponse;
  
  // Adapt for first-time mental health engagement
  if (clientContext.isFirstTimeWithMentalHealth) {
    adaptedResponse = adaptedResponse.replace(
      /professional support|specialized care|resources/gi,
      match => `additional support options`
    );
    
    // Add gentle explanation of mental health support
    adaptedResponse += " Finding the right support can be a new process, and I'm here to help navigate that with you.";
  }
  
  // Adapt for formal language preference
  if (clientContext.prefersFormalLanguage) {
    adaptedResponse = adaptedResponse
      .replace(/I'm/g, "I am")
      .replace(/Let's/g, "Let us")
      .replace(/don't/g, "do not")
      .replace(/can't/g, "cannot");
      
    // More formal closing
    if (!adaptedResponse.includes("at your convenience") && !adaptedResponse.includes("at your discretion")) {
      adaptedResponse += " Please let me know how you would prefer to proceed.";
    }
  }
  
  // Adapt for direct approach preference
  if (clientContext.prefersDirectApproach) {
    // Remove hedging language
    adaptedResponse = adaptedResponse
      .replace(/perhaps|maybe|might|could possibly|I think that/gi, "")
      .replace(/would it be helpful if/gi, "let's")
      .replace(/I wonder if/gi, "");
      
    // More direct closing
    if (adaptedResponse.includes("Would you like to") || adaptedResponse.includes("Would it help to")) {
      adaptedResponse = adaptedResponse.replace(/Would you like to.*\?|Would it help to.*\?/gi, 
        "Let's discuss specific next steps that would work for you.");
    }
  }
  
  return adaptedResponse;
};

// Function to generate culturally sensitive trauma-informed responses
export const generateClientCenteredTraumaResponse = (
  analysis: TraumaResponseAnalysis, 
  clientPreferences?: {
    prefersFormalLanguage?: boolean;
    prefersDirectApproach?: boolean;
    isFirstTimeWithMentalHealth?: boolean;
  }
): string => {
  // Start with a base response based on the dominant trauma response pattern
  let baseResponse = "";
  
  if (!analysis.dominant4F) {
    return "I'm here to listen and support you through what you're experiencing.";
  }
  
  switch (analysis.dominant4F.type) {
    case 'freeze':
      baseResponse = `I notice that when faced with certain situations, you might feel stuck or disconnected. This is actually a natural protective response that helped keep you safe in the past. We can explore ways to help you feel more grounded and present when this happens.`;
      break;
    case 'fight':
      baseResponse = `I hear that you sometimes feel a strong need to protect yourself or stand your ground. This defensive response served an important purpose for you at some point. Together, we can explore ways to channel this energy constructively while ensuring your needs are met.`;
      break;
    case 'flight':
      baseResponse = `I notice that in certain situations, you might feel an urge to escape or avoid. This is actually your body's way of trying to protect you. We can work together on strategies that help you feel safe while gradually engaging with challenging situations at your own pace.`;
      break;
    case 'fawn':
      baseResponse = `I'm hearing that you sometimes prioritize others' needs above your own comfort or safety. This response likely helped you navigate difficult relationships in the past. We can explore ways to honor both your natural compassion and your own important needs.`;
      break;
  }
  
  // Add intensity-specific language using the correct SeverityLevel values
  if (analysis.dominant4F.intensity === 'critical' || analysis.dominant4F.intensity === 'high') {
    baseResponse += " These responses can sometimes feel overwhelming or outside your control, which makes complete sense given their protective origins.";
  }
  
  // Add hybrid-specific language if there's a secondary pattern
  if (analysis.hybrid && analysis.secondary4F) {
    baseResponse += ` I also notice that sometimes you respond by ${getResponseDescription(analysis.secondary4F.type)}, which shows how adaptable you've needed to be.`;
  }
  
  // Add acknowledgment of anger if present
  if (analysis.angerLevel === 'angry' || analysis.angerLevel === 'enraged') {
    baseResponse += " I hear the frustration and anger in what you're describing, which is a completely valid response to what you've experienced.";
  }
  
  // Add a supportive closing that emphasizes partnership
  baseResponse += " I'm here to support you in understanding these responses and exploring strategies that work for you. What aspects of this would be most helpful to focus on?";
  
  // Adapt the response based on client preferences if provided
  if (clientPreferences) {
    return adaptToneForClientPreference(baseResponse, clientPreferences);
  }
  
  return baseResponse;
};

// Helper function to describe response types
const getResponseDescription = (responseType: 'fight' | 'flight' | 'freeze' | 'fawn'): string => {
  switch (responseType) {
    case 'freeze':
      return "disconnecting or feeling immobilized";
    case 'fight':
      return "becoming protective or standing your ground";
    case 'flight':
      return "seeking distance or escape";
    case 'fawn':
      return "focusing on others' needs or seeking harmony";
  }
};

/**
 * New function for de-escalating defensive reactions in high-stress situations
 */
export const handleDefensiveResponse = (
  userInput: string,
  severity: SeverityLevel
): string => {
  // Check if user is displaying defensive patterns
  const defensiveIndicators = /no|not|don't|won't|can't|refuse|leave me alone|stop|quit/i;
  
  if (!defensiveIndicators.test(userInput)) {
    return "";
  }
  
  // Tailor response based on severity level
  switch (severity) {
    case 'critical':
      return "I can hear that you're feeling frustrated or overwhelmed right now. That's completely understandable. I'm not here to push you into anything - I just want to make sure you're okay.";
    case 'high':
      return "I hear that this might not feel like the right approach for you right now. That's okay. Sometimes it helps just to know that someone is listening without judgment.";
    case 'medium':
      return "I can sense some resistance, and that's perfectly normal. Sometimes talking about difficult things can feel overwhelming. We can go at whatever pace feels right for you.";
    case 'low':
      return "I understand you might have some hesitation about this. That's completely natural, and there's no pressure to discuss anything you're not comfortable with.";
    default:
      return "I hear you, and I want to respect where you're at right now.";
  }
};
