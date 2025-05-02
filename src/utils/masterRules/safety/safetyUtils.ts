
/**
 * Safety-related detection and handling utilities
 */

/**
 * Emergency detection function
 * @param userInput The user's message
 * @returns Whether the input indicates an emergency situation
 */
export const isEmergency = (userInput: string): boolean => {
  const emergencyPatterns = [
    /emergency|urgent|crisis|critical|life.threatening|immediate danger/i,
    /need (immediate|urgent|emergency) (help|assistance|care)/i,
    /can'?t breathe|having (a|an) (heart attack|seizure|stroke)/i,
    /bleeding (heavily|severely|profusely|uncontrollably)/i,
    /dying|about to die|going to die/i
  ];
  
  return emergencyPatterns.some(pattern => pattern.test(userInput));
};

/**
 * Emergency handling function
 * @returns Emergency response with appropriate resources
 */
export const handleEmergency = (): string => {
  return "I detect this might be a medical emergency. If you or someone else is in immediate danger, please call 911 or your local emergency number right away. Don't wait. If you're able to safely get to an emergency room, please do so immediately. Your safety is the absolute priority right now.";
};

/**
 * Medical advice detection function
 * @param userInput The user's message
 * @returns Whether the input is asking for direct medical advice
 */
export const isDirectMedicalAdvice = (userInput: string): boolean => {
  const medicalAdvicePatterns = [
    /should I take|should I stop taking|should I switch|what (medication|medicine|drug|dosage)/i,
    /is it safe to (take|use|combine|mix)|drug interaction/i,
    /diagnosis|diagnose|medical condition|medical advice|treatment (for|plan|option)/i,
    /what (is|are) (the|my) (symptoms|condition|illness|disease|diagnosis)/i,
    /what (medication|medicine|drug|treatment|therapy) (should|would|could|can) (I|me|someone)/i
  ];
  
  return medicalAdvicePatterns.some(pattern => pattern.test(userInput));
};

/**
 * Direct medical advice handling function
 * @returns Medical advice disclaimer response
 */
export const handleDirectMedicalAdvice = (): string => {
  return "I notice you're asking about a medical issue. I'm not a medical professional and can't provide medical advice, diagnoses, or treatment recommendations. For specific medical questions, please consult with a qualified healthcare provider. Would it be helpful to discuss general wellness topics or stress management strategies instead?";
};

/**
 * Suicidal ideation detection function
 * @param userInput The user's message
 * @returns Whether the input indicates suicidal ideation
 */
export const isSuicidalIdeation = (userInput: string): boolean => {
  const suicidalIdeationPatterns = [
    /suicid(e|al)|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)/i,
    /don'?t want to (live|be alive)|take my (own )?life|killing myself|commit suicide|die by suicide/i,
    /fatal overdose|hang myself|jump off|i wish i was dead|i want to die|i might kill/i,
    /no (reason|point) (in|to) (living|life)|better off dead|can'?t go on/i,
    /plan to (kill|end|hurt|harm)/i
  ];
  
  return suicidalIdeationPatterns.some(pattern => pattern.test(userInput));
};

/**
 * Suicidal ideation handling function
 * @returns Crisis response with appropriate resources
 */
export const handleSuicidalIdeation = (): string => {
  return "I'm concerned about what you've shared. If you're having thoughts about harming yourself, please reach out for immediate help. The National Suicide Prevention Lifeline is available 24/7 at 988 or 1-800-273-8255. You can also text HOME to the Crisis Text Line at 741741. If you're in immediate danger, please call 911 or go to your nearest emergency room. Your life matters, and trained professionals are ready to support you through this difficult time.";
};
