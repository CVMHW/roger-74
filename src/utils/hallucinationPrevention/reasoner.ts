
/**
 * Chain-of-thought reasoning for response verification
 */

interface ReasoningStep {
  claim: string;
  confidence: number;
}

interface ReasoningResult {
  isLogicallySound: boolean;
  verifiedResponse: string;
  confidence: number;
  reasoningSteps?: ReasoningStep[];
}

/**
 * Applies reasoning to verify response logical consistency
 */
export const applyReasoning = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): ReasoningResult => {
  // Start with assuming logical soundness
  let isLogicallySound = true;
  let verifiedResponse = responseText;
  let confidence = 1.0;
  const reasoningSteps: ReasoningStep[] = [];
  
  // Check for problematic patterns that indicate logical issues
  
  // 1. Check for contradictions in memory claims
  if (/you (mentioned|said|told me) .* but .* you (mentioned|said|told me)/i.test(responseText)) {
    reasoningSteps.push({
      claim: "Response contains contradictory memory claims",
      confidence: 0.3
    });
    isLogicallySound = false;
    confidence *= 0.7;
    
    // Replace with a more cautious statement
    verifiedResponse = verifiedResponse.replace(
      /you (mentioned|said|told me) .* but .* you (mentioned|said|told me)/i,
      "based on what you're sharing"
    );
  }
  
  // 2. Check for contradictions within the response
  if (/this is (.*), but it is also (.*) which contradicts/i.test(responseText)) {
    reasoningSteps.push({
      claim: "Response contains internal contradiction",
      confidence: 0.2
    });
    isLogicallySound = false;
    confidence *= 0.6;
  }
  
  // 3. Check for emotional inconsistencies
  const emotionMatch = responseText.match(/you('re| are) feeling (\w+)/i);
  if (emotionMatch) {
    const claimedEmotion = emotionMatch[2].toLowerCase();
    
    // Check if the claimed emotion conflicts with the user input
    if (
      (claimedEmotion === 'happy' && /sad|depress|upset|down|low|worried|anxious/i.test(userInput)) ||
      (claimedEmotion === 'calm' && /anxious|worried|stress|panic|anxiet/i.test(userInput)) ||
      (claimedEmotion === 'fine' && /not fine|not okay|not good|bad|awful|terrible/i.test(userInput))
    ) {
      reasoningSteps.push({
        claim: `Response claims user feels ${claimedEmotion} which contradicts their input`,
        confidence: 0.2
      });
      isLogicallySound = false;
      confidence *= 0.5;
      
      // Fix the emotional inconsistency
      verifiedResponse = verifiedResponse.replace(
        new RegExp(`you('re| are) feeling ${claimedEmotion}`, 'i'),
        userInput.includes('depress') ? "you're feeling depressed" : 
          userInput.includes('anxious') ? "you're feeling anxious" :
          userInput.includes('sad') ? "you're feeling sad" : 
          "what you're going through"
      );
    }
  }
  
  // Return the reasoning result
  return {
    isLogicallySound,
    verifiedResponse,
    confidence,
    reasoningSteps
  };
};
