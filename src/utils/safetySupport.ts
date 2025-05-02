
/**
 * Utilities for safety and patient-centered support
 * Implements the unconditional rule about deescalation and customer-centric care
 */

import { ConcernType } from './reflection/reflectionTypes';
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
  
  // Add intensity-specific language
  if (analysis.dominant4F.intensity === 'severe' || analysis.dominant4F.intensity === 'extreme') {
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
 * New function for de-escalating defensive reactions to mental health suggestions
 * Especially for situations where patients feel misdiagnosed or react strongly
 * @param reaction The type of reaction the patient is having
 * @param suggestedConcern The mental health concern that was suggested
 * @returns De-escalation response that validates while maintaining appropriate boundaries
 */
export const deescalateDefensiveReaction = (
  reaction: 'denial' | 'anger' | 'accusation' | 'profanity' | 'dismissal',
  suggestedConcern: ConcernType | string
): string => {
  // Common opening validations that acknowledge the patient's reaction
  const validationOpeners = [
    "I hear that this suggestion doesn't feel right to you, and I want to acknowledge that reaction.",
    "I appreciate you expressing how you feel about this. Your perspective is important.",
    "I understand this is frustrating to hear, and I value your reaction to it.",
    "Thank you for being direct about how this feels for you. That helps me understand your perspective better.",
    "I can see this suggestion has touched on something important, and your reaction makes sense."
  ];
  
  // Statements that clarify Roger's role and limitations
  const roleStatements = [
    "As a peer support companion, I don't diagnose or make definitive clinical judgments.",
    "I want to clarify that I'm not qualified to diagnose any conditions, only to suggest potential resources that might be helpful.",
    "I'm trained to identify potential concerns that might benefit from specialized support, not to make diagnoses.",
    "My role is to listen and provide support, including suggesting resources when certain topics arise.",
    "I'm here to support you, not to label or diagnose - only licensed professionals can determine clinical diagnoses."
  ];
  
  // Statements that maintain connection while acknowledging the reaction
  const connectionStatements = [
    "I'm still here with you through this difficult moment.",
    "I value our conversation and want to continue supporting you in a way that feels helpful.",
    "I remain focused on what would be most supportive for you right now.",
    "I'm here with you regardless of any specific concerns or labels.",
    "My priority is providing support that respects your experience and perspective."
  ];
  
  // Statements that offer autonomy and choice
  const autonomyStatements = [
    "You're in control of how we proceed, and I respect whatever direction you want to take.",
    "You know yourself best, and I honor your understanding of your own experiences.",
    "You have complete choice in what resources feel appropriate and helpful for you.",
    "Your self-knowledge is central here, and I respect your perspective on what resonates.",
    "Only you can decide what support feels right, and I'm here to assist with that process."
  ];
  
  // Special additional statements for anger with profanity
  const angryDeescalation = [
    "I understand this has provoked strong feelings, which is completely valid.",
    "It makes sense that you'd feel strongly about this - mental health suggestions can feel very personal.",
    "I hear your intensity on this topic, and I want to make sure we proceed in a way that feels respectful to you.",
    "Strong reactions to mental health suggestions are common and understandable - they touch on core aspects of identity.",
    "I appreciate your honesty about how this feels, including the intensity of your reaction."
  ];
  
  // Build response based on reaction type
  let response = validationOpeners[Math.floor(Math.random() * validationOpeners.length)] + " ";
  
  // Add more targeted language based on reaction type
  if (reaction === 'anger' || reaction === 'profanity') {
    response += angryDeescalation[Math.floor(Math.random() * angryDeescalation.length)] + " ";
  }
  
  // Add role clarification
  response += roleStatements[Math.floor(Math.random() * roleStatements.length)] + " ";
  
  // Add connection maintenance 
  response += connectionStatements[Math.floor(Math.random() * connectionStatements.length)] + " ";
  
  // Add autonomy statements
  response += autonomyStatements[Math.floor(Math.random() * autonomyStatements.length)];
  
  return response;
};

// Now let's update the detection utility to recognize defensive reactions
export const detectDefensiveReaction = (userInput: string): {
  isDefensive: boolean;
  reactionType: 'denial' | 'anger' | 'accusation' | 'profanity' | 'dismissal' | null;
  suggestedConcern: string | null;
} => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for denial patterns
  const denialPatterns = [
    /i['']m not ([a-zA-Z\s]+)(!+)?/i,
    /don['']t (call|label|say) (?:i['']m|me|that i['']m|that i am) ([a-zA-Z\s]+)/i,
    /that['']s not (me|what i am|who i am)/i,
    /i don['']t have ([a-zA-Z\s]+)/i
  ];
  
  // Check for anger patterns
  const angerPatterns = [
    /you['']re (pissing|making) me (?:off|angry|mad)/i,
    /that makes me (?:angry|mad|upset|furious)/i,
    /how dare you/i,
    /who (?:the hell|the fuck)? (?:do you think you are|are you)/i,
    /i['']m (?:so|really|getting|becoming) (?:angry|mad|pissed|upset)/i
  ];
  
  // Check for accusation patterns
  const accusationPatterns = [
    /you don['']t know (?:me|anything about me|what you['"]re talking about)/i,
    /you['"]re (?:judging|assuming|labeling)/i,
    /stop (?:judging|assuming|labeling)/i,
    /you['"]ve got me all wrong/i,
    /you['"]re not listening/i
  ];
  
  // Check for profanity (simplified version)
  const hasProfanity = /fuck|shit|damn|bitch|ass|crap/i.test(lowerInput);
  
  // Check for dismissal patterns
  const dismissalPatterns = [
    /whatever/i,
    /i don['"]t care/i,
    /forget (?:it|this)/i,
    /this is (?:bullshit|pointless|useless)/i,
    /i['"]m (?:done|leaving|out)/i
  ];
  
  // Check for mental health terms being referenced
  const mentalHealthTerms = [
    'bipolar', 'depression', 'anxiety', 'schizophrenia', 'adhd', 'add', 'borderline',
    'ocd', 'ptsd', 'autism', 'eating disorder', 'anorexia', 'bulimia', 
    'addiction', 'alcoholic', 'substance abuse', 'trauma'
  ];
  
  // Detect mental health term if present
  let suggestedConcern: string | null = null;
  for (const term of mentalHealthTerms) {
    if (lowerInput.includes(term)) {
      suggestedConcern = term;
      break;
    }
  }
  
  // Determine reaction type
  let reactionType: 'denial' | 'anger' | 'accusation' | 'profanity' | 'dismissal' | null = null;
  
  if (denialPatterns.some(pattern => pattern.test(lowerInput))) {
    reactionType = 'denial';
  } else if (angerPatterns.some(pattern => pattern.test(lowerInput))) {
    reactionType = 'anger';
  } else if (hasProfanity) {
    reactionType = 'profanity';
  } else if (accusationPatterns.some(pattern => pattern.test(lowerInput))) {
    reactionType = 'accusation';
  } else if (dismissalPatterns.some(pattern => pattern.test(lowerInput))) {
    reactionType = 'dismissal';
  }
  
  return {
    isDefensive: reactionType !== null,
    reactionType,
    suggestedConcern
  };
};

// REMOVED THE DUPLICATE EXPORT BLOCK THAT WAS CAUSING ERRORS
