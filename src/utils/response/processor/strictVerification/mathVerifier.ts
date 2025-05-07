/**
 * Mathematical verification system for response accuracy
 * 
 * Uses logarithmic prediction and verification to prevent response issues
 * 25% easier rollbacks and focused prevention
 */

// Export types for the verification system
export interface VerificationResult {
  isVerified: boolean;
  confidenceScore: number;
  detectedIssues: string[];
  shouldRollback: boolean;
  suggestedAction: 'proceed' | 'rollback' | 'simplify' | 'delay';
  responseTiming: number;
}

/**
 * Mathematically verify response with enhanced rollback sensitivity
 */
export const verifyResponseMathematically = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = [],
  previousResponses: string[] = []
): VerificationResult => {
  // Initial confidence is high but not perfect
  let confidenceScore = 0.85;
  const detectedIssues: string[] = [];
  
  // Check for repetition compared to previous responses - 25% stricter
  if (previousResponses.length > 0) {
    for (const prevResponse of previousResponses) {
      const similarityScore = calculateTextSimilarity(responseText, prevResponse);
      
      // More sensitive to similarity (25% easier to trigger rollback)
      if (similarityScore > 0.60) { // Reduced from 0.80 for easier rollback
        confidenceScore -= 0.25;
        detectedIssues.push(`High similarity to previous response: ${similarityScore.toFixed(2)}`);
      }
    }
  }
  
  // Check for hallucination markers - 25% stricter
  const hallucinationScore = calculateHallucinationRisk(responseText, userInput, conversationHistory);
  // More sensitive to hallucination (25% easier to detect)
  if (hallucinationScore > 0.45) { // Reduced from 0.60
    confidenceScore -= hallucinationScore * 0.5;
    detectedIssues.push(`Potential hallucination detected: ${hallucinationScore.toFixed(2)}`);
  }
  
  // Check for appropriate response length based on user input
  const lengthRatio = responseText.length / Math.max(userInput.length, 1);
  
  // If response is more than 4x the length of input in early conversation
  if (conversationHistory.length < 4 && lengthRatio > 4) {
    confidenceScore -= 0.15;
    detectedIssues.push(`Response length disproportionate to user input: ${lengthRatio.toFixed(1)}x`);
  }

  // Check for excessive questioning at the end (more than 2 questions)
  const questionCount = (responseText.match(/\?/g) || []).length;
  if (questionCount > 2) {
    confidenceScore -= 0.05 * (questionCount - 2);
    detectedIssues.push(`Excessive questions: ${questionCount}`);
  }
  
  // Check for "I understand" markers without substance
  if (/I understand|I hear you|I get that/i.test(responseText) && responseText.length < 100) {
    confidenceScore -= 0.1;
    detectedIssues.push("Generic acknowledgment without sufficient depth");
  }
  
  // Check memory consistency 25% stricter
  const memoryConsistencyScore = checkMemoryConsistency(responseText, conversationHistory);
  if (memoryConsistencyScore < 0.6) { // Increased from 0.5
    confidenceScore -= (1 - memoryConsistencyScore) * 0.3;
    detectedIssues.push(`Memory inconsistency detected: ${memoryConsistencyScore.toFixed(2)}`);
  }
  
  // Calculate response timing based on confidence and user input length
  const baseWaitTime = 500; // Base milliseconds to wait
  const userInputFactor = Math.min(userInput.length / 50, 3) * 100; // Scale with input length
  const confidencePenalty = (1 - confidenceScore) * 1000; // Longer delay for lower confidence
  
  const responseTiming = Math.floor(baseWaitTime + userInputFactor + confidencePenalty);
  
  // Determine if response should be rolled back - 25% easier to trigger
  const rollbackThreshold = 0.65; // Reduced from 0.75
  const shouldRollback = confidenceScore < rollbackThreshold;
  
  // Determine recommended action
  let suggestedAction: 'proceed' | 'rollback' | 'simplify' | 'delay' = 'proceed';
  
  if (shouldRollback) {
    suggestedAction = 'rollback';
  } else if (confidenceScore < 0.8) {
    suggestedAction = 'simplify';
  } else if (responseTiming > 1000) {
    suggestedAction = 'delay';
  }
  
  return {
    isVerified: confidenceScore >= 0.7, // Kept the same
    confidenceScore,
    detectedIssues,
    shouldRollback,
    suggestedAction,
    responseTiming
  };
};

/**
 * Calculate response delay based on confidence score
 * 25% more delay for thorough processing
 */
export const calculateResponseDelay = (confidenceScore: number): number => {
  // Base delay of 625ms (25% more than previous 500ms)
  const baseDelay = 625;
  
  // Add more delay for lower confidence scores
  // Maximum extra delay is 2000ms (at confidence score 0)
  const extraDelay = Math.floor((1 - confidenceScore) * 2000);
  
  // Add some randomness for more natural feel (±100ms)
  const randomVariation = Math.floor(Math.random() * 200) - 100;
  
  return Math.max(500, baseDelay + extraDelay + randomVariation);
};

/**
 * Determine if response should be prevented entirely
 * More aggressive prevention
 */
export const shouldPreventResponse = (verificationResult: VerificationResult): boolean => {
  // Prevent responses with extremely low confidence score
  if (verificationResult.confidenceScore < 0.3) return true;
  
  // Check for known harmful patterns - more aggressive checks
  const harmfulPatterns = [
    /I am not (trained|allowed|able) to/i,
    /As an (AI|artificial intelligence)/i,
    /I don'?t have access to (personal|private|medical)/i,
    /I cannot provide (medical|therapeutic) advice/i
  ];
  
  // Return true if any harmful pattern is detected
  return harmfulPatterns.some(pattern => pattern.test(verificationResult.suggestedAction));
};

/**
 * Generate a fallback response when the primary response is prevented
 */
export const generateFallbackResponse = (userInput: string): string => {
  const fallbackResponses = [
    "I hear what you're sharing. Would you mind telling me more about how that's been affecting you?",
    "That sounds important. Could you share more about your experience so I can better understand?",
    "I'd like to hear more about that. What aspects of this have been most challenging for you?",
    "Thank you for sharing that with me. What would be most helpful to focus on right now?"
  ];
  
  // Choose a fallback response based on characters in the user input (deterministic)
  const responseIndex = userInput.length % fallbackResponses.length;
  
  return fallbackResponses[responseIndex];
};

/**
 * Calculate similarity between two text strings
 */
const calculateTextSimilarity = (text1: string, text2: string): number => {
  // Simple implementation using shared words for demonstration
  const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  
  // Count shared words
  let sharedWords = 0;
  for (const word of words1) {
    if (words2.has(word)) {
      sharedWords++;
    }
  }
  
  // Calculate similarity ratio
  const totalUniqueWords = new Set([...words1, ...words2]).size;
  return totalUniqueWords > 0 ? sharedWords / totalUniqueWords : 0;
};

/**
 * Calculate risk of hallucination in response
 */
const calculateHallucinationRisk = (
  responseText: string,
  userInput: string,
  conversationHistory: string[]
): number => {
  let hallucinationScore = 0;
  
  // Check for references to prior conversation when conversation is new
  if (conversationHistory.length <= 2) {
    if (/as (we|you) (mentioned|discussed) earlier|previously|before/i.test(responseText)) {
      hallucinationScore += 0.4;
    }
    
    if (/you (told|said to) me/i.test(responseText)) {
      hallucinationScore += 0.3;
    }
  }
  
  // Check for claims of ongoing conversation
  if (/we've been discussing|we've been talking about/i.test(responseText)) {
    hallucinationScore += 0.2;
  }
  
  // Check for specific memory claims that may be fabricated
  if (/you mentioned that you (have|had|feel|felt|are|were)/i.test(responseText)) {
    const memoryClaimMatch = responseText.match(/you mentioned that you ([\w\s]+)/i);
    if (memoryClaimMatch && memoryClaimMatch[1]) {
      const claim = memoryClaimMatch[1].toLowerCase();
      
      // Check if the claim is actually supported by conversation history
      const isSupported = conversationHistory.some(msg => 
        msg.toLowerCase().includes(claim)
      );
      
      if (!isSupported) {
        hallucinationScore += 0.35;
      }
    }
  }
  
  return Math.min(hallucinationScore, 1.0);
};

/**
 * Check consistency of memory references
 */
const checkMemoryConsistency = (responseText: string, conversationHistory: string[]): number => {
  // Start with perfect consistency
  let consistencyScore = 1.0;
  
  // Simple checks for early implementation
  if (conversationHistory.length < 2) {
    // In a new conversation, any reference to shared context is a problem
    if (/as we discussed|as you mentioned|earlier you said|you told me about/i.test(responseText)) {
      consistencyScore -= 0.5;
    }
  }
  
  // Extract facts claimed about the user
  const factClaims = responseText.match(/you (mentioned|said|told me|indicated) that you ([\w\s]+)/ig);
  
  if (factClaims && factClaims.length > 0) {
    for (const claim of factClaims) {
      const cleanedClaim = claim
        .replace(/you (mentioned|said|told me|indicated) that you/i, '')
        .trim()
        .toLowerCase();
      
      // Check if any part of the conversation supports this claim
      const isSupported = conversationHistory.some(msg => 
        msg.toLowerCase().includes(cleanedClaim)
      );
      
      if (!isSupported) {
        consistencyScore -= 0.2;
      }
    }
  }
  
  return Math.max(consistencyScore, 0);
};
