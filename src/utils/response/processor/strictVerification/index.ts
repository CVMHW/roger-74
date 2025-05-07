
/**
 * Strict Verification System
 * 
 * Provides mathematical verification of responses to ensure compliance
 * with therapeutic boundaries and response quality
 */

export interface VerificationResult {
  isVerified: boolean;
  confidenceScore: number;
  detectedIssues: string[];
  suggestedAction: 'proceed' | 'modify' | 'regenerate';
  shouldRollback: boolean;
  responseTiming: number;
  altText?: string;
}

/**
 * Mathematically verify response against user input
 * 
 * @param responseText Generated response text
 * @param userInput Original user input
 * @param conversationHistory Optional conversation history
 * @returns Verification result
 */
export const verifyResponseMathematically = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): VerificationResult => {
  // Default to verified (optimistic approach)
  let isVerified = true;
  let confidenceScore = 0.95;
  const detectedIssues: string[] = [];
  
  // Check for empty response
  if (!responseText || responseText.trim().length === 0) {
    return {
      isVerified: false,
      confidenceScore: 0.1,
      detectedIssues: ['Empty response'],
      suggestedAction: 'regenerate',
      shouldRollback: true,
      responseTiming: 0,
      altText: "I'm listening. What's been going on with you?"
    };
  }
  
  // Check for excessively short responses to substantive messages
  if (responseText.length < 50 && userInput.length > 100) {
    detectedIssues.push('Response too short for detailed user input');
    confidenceScore -= 0.3;
  }
  
  // Check for response that doesn't acknowledge question
  const isQuestion = userInput.includes("?");
  if (isQuestion && !responseText.includes("?") && 
      !/(here's|I can share|to answer your question|regarding your|about your)/i.test(responseText)) {
    detectedIssues.push('Question not acknowledged');
    confidenceScore -= 0.2;
  }
  
  // Check for mismatched emotional acknowledgment
  if (/sad|depress/i.test(userInput) && /happy|great|wonderful|excellent/i.test(responseText)) {
    detectedIssues.push('Emotional tone mismatch');
    confidenceScore -= 0.4;
    
    // This is serious enough to force rejection
    isVerified = false;
  }
  
  // Check for therapeutic label misapplication
  if (/(you have|you're experiencing|you suffer from|diagnosis|clinical|disorder)\b/i.test(responseText)) {
    detectedIssues.push('Potential diagnostic language');
    confidenceScore -= 0.3;
  }
  
  // Determine verification result
  isVerified = isVerified && confidenceScore >= 0.7;
  
  // Set appropriate response timing based on confidence
  const responseTiming = calculateResponseDelay(confidenceScore);
  
  return {
    isVerified,
    confidenceScore,
    detectedIssues,
    suggestedAction: 
      confidenceScore < 0.5 ? 'regenerate' : 
      confidenceScore < 0.7 ? 'modify' : 
      'proceed',
    shouldRollback: confidenceScore < 0.7,
    responseTiming,
    altText: confidenceScore < 0.4 ? generateAltText(userInput, detectedIssues) : undefined
  };
};

/**
 * Calculate response delay based on confidence score
 * @param confidenceScore Confidence score from verification
 * @returns Delay in milliseconds
 */
export const calculateResponseDelay = (confidenceScore: number): number => {
  // Lower confidence = longer delay to give time for reflection
  if (confidenceScore < 0.5) return 1500;
  if (confidenceScore < 0.7) return 1200;
  if (confidenceScore < 0.9) return 800;
  return 500;
};

/**
 * Generate alternative text when verification fails badly
 */
function generateAltText(userInput: string, issues: string[]): string {
  // Use a simple, safe response that acknowledges the user input
  const safeResponses = [
    "I hear what you're sharing. Could you tell me more about how you've been feeling about this?",
    "Thank you for sharing that with me. What aspect of this has been most challenging for you?",
    "I appreciate you telling me about this. How has this been affecting your day-to-day life?",
    "That sounds important. Could you help me understand more about what you're experiencing?"
  ];
  
  // Choose based on user input length for some variety
  const index = Math.abs(userInput.length) % safeResponses.length;
  return safeResponses[index];
}
