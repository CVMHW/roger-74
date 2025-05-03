
/**
 * Safety utilities for handling emergency and crisis situations
 * PRIORITIZED: Safety is top priority, memory is second priority
 */

import { recordToMemory } from '../../nlpProcessor';
import { addToFiveResponseMemory } from '../../memory/fiveResponseMemory';

/**
 * Records safety interactions to ALL memory systems
 * This ensures critical safety responses are never lost
 */
const recordSafetyInteractionToAllMemorySystems = (userInput: string, response: string) => {
  try {
    // Record to primary memory system
    recordToMemory(userInput, response);
    
    // Record to 5ResponseMemory backup system 
    addToFiveResponseMemory('patient', userInput);
    addToFiveResponseMemory('roger', response);
  } catch (error) {
    console.error("CRITICAL ERROR: Failed to record safety interaction to memory:", error);
    
    // Try again with emergency prefix to highlight importance
    try {
      recordToMemory("EMERGENCY: " + userInput, response);
    } catch (secondError) {
      console.error("CATASTROPHIC MEMORY FAILURE during safety response:", secondError);
    }
  }
};

/**
 * Checks if user input indicates an emergency situation
 * @param userInput User message
 * @returns Whether an emergency is detected
 */
export const isEmergency = (userInput: string): boolean => {
  const emergencyPatterns = [
    /emergency|crisis|911|urgent|need help now|immediate danger|hurt(ing)? (myself|someone)|harm(ing)? (myself|someone)/i,
    /suicide|kill (myself|me)|end (my|this) life|don'?t want to (live|be alive)|take my (own )?life/i,
    /overdos(e|ing)|jump(ing)? (off|from)|hang(ing)? myself|slit(ting)? (my )?wrist/i
  ];
  
  return emergencyPatterns.some(pattern => pattern.test(userInput));
};

/**
 * Generates an appropriate response for emergency situations
 * @returns Emergency response message
 */
export const handleEmergency = (userInput: string): string => {
  const response = "I'm concerned about what you're sharing. If you're in immediate danger or experiencing a mental health emergency, please reach out to emergency services by calling 911 or a crisis hotline like the 988 Suicide & Crisis Lifeline (call or text 988). Would you like me to share more crisis resources with you?";
  
  // CRITICAL: Record emergency interaction to ALL memory systems
  recordSafetyInteractionToAllMemorySystems(userInput, response);
  
  return response;
};

/**
 * Checks if user input is requesting direct medical advice
 * @param userInput User message
 * @returns Whether medical advice is being requested
 */
export const isDirectMedicalAdvice = (userInput: string): boolean => {
  const medicalAdvicePatterns = [
    /should I take (this|my|these) (medication|med|pill|drug)/i,
    /what (medication|med|pill|drug) should I (take|use)/i,
    /diagnos(e|is)/i,
    /correct (dosage|dose)/i,
    /medical (advice|opinion|diagnosis)/i,
    /change (my|the) (medication|med|dosage)/i
  ];
  
  return medicalAdvicePatterns.some(pattern => pattern.test(userInput));
};

/**
 * Generates a response for requests for medical advice
 * @returns Medical advice boundary response
 */
export const handleDirectMedicalAdvice = (userInput: string): string => {
  const response = "I understand you're asking about medical advice, but I'm not qualified to give medical or medication guidance. These questions are best directed to your healthcare provider who knows your full medical history and can give you proper advice. Would it be helpful to talk about strategies for discussing this with your doctor?";
  
  // Record to ALL memory systems
  recordSafetyInteractionToAllMemorySystems(userInput, response);
  
  return response;
};

/**
 * Checks if user input indicates suicidal ideation
 * @param userInput User message
 * @returns Whether suicidal ideation is detected
 */
export const isSuicidalIdeation = (userInput: string): boolean => {
  const suicidalIdeationPatterns = [
    /suicid(e|al)|kill (myself|me)|end (my|this) life|don'?t want to (live|be alive)|take my (own )?life/i,
    /no (point|reason) (in|to) (living|life)|better off dead|can'?t (go on|continue)/i,
    /want to die|dying seems|death wish|planning (my )?suicide|goodbye (forever|for good)/i
  ];
  
  return suicidalIdeationPatterns.some(pattern => pattern.test(userInput));
};

/**
 * Generates a response for suicidal ideation
 * @returns Suicidal ideation response with resources
 */
export const handleSuicidalIdeation = (userInput: string): string => {
  const response = "I'm really concerned about what you're sharing. Your life matters, and there are people who want to help. Please consider calling the 988 Suicide & Crisis Lifeline (call or text 988) to speak with a trained counselor, or go to your nearest emergency room. Would it be helpful if I shared some additional crisis resources with you?";
  
  // CRITICAL PRIORITY: Record to ALL memory systems
  recordSafetyInteractionToAllMemorySystems(userInput, response);
  
  return response;
};
