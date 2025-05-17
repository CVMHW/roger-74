
/**
 * Enhanced Hallucination Detection System V2
 */

/**
 * Interface for hallucination detection results
 */
export interface HallucinationCheck {
  isHallucination: boolean;
  confidence: number;
  reason?: string;
}

/**
 * Detect potential hallucinations in a response
 */
export const detectHallucinations = (
  responseText: string, 
  userInput: string,
  conversationHistory: string[] = []
): HallucinationCheck => {
  // Implement hallucination detection logic
  const lowerResponse = responseText.toLowerCase();
  const lowerInput = userInput.toLowerCase();
  
  // Check for memory references in early conversation
  if (conversationHistory.length < 3) {
    const hasMemoryReference = /previously you|earlier you|you mentioned|as you said|we discussed|our previous session|last time we|you've been telling me/i.test(responseText);
    
    if (hasMemoryReference) {
      return {
        isHallucination: true,
        confidence: 0.95,
        reason: 'early_conversation_memory_reference'
      };
    }
  }
  
  // Check for casual content in crisis responses
  if (/suicide|kill myself|self-harm|eating disorder|depression|mental health|substance-use|drinking|alcohol/i.test(lowerInput)) {
    if (/brewery|restaurant|pub|bar|craft beer|great lakes brewing|food|recipe|social gathering|concert/i.test(lowerResponse)) {
      return {
        isHallucination: true,
        confidence: 0.98,
        reason: 'critical_crisis_casual_mixing'
      };
    }
  }
  
  // Check for contextual mismatch
  if (/depression|depressed|sad|down|upset|anxious|anxiety/i.test(lowerInput)) {
    if (/food|eating|body image|weight/i.test(lowerResponse) && 
        !(/food|eating|body image|weight/i.test(lowerInput))) {
      return {
        isHallucination: true,
        confidence: 0.9,
        reason: 'contextual_mismatch'
      };
    }
  }
  
  // Check for repeated phrases that might indicate hallucination
  const phrases = responseText.split(/[.!?]\s+/);
  for (let i = 0; i < phrases.length; i++) {
    for (let j = i + 1; j < phrases.length; j++) {
      if (phrases[i] && phrases[j] && 
          phrases[i].length > 10 && 
          phrases[i].toLowerCase() === phrases[j].toLowerCase()) {
        return {
          isHallucination: true,
          confidence: 0.85,
          reason: 'repeated_phrase_hallucination'
        };
      }
    }
  }
  
  // No hallucination detected
  return {
    isHallucination: false,
    confidence: 0
  };
};
