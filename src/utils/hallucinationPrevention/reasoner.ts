
/**
 * Reasoning System
 * 
 * Implements "chain of thought" reasoning to reduce hallucinations
 * by breaking complex responses into steps and verifying each step.
 */

interface ReasoningStep {
  claim: string;
  evidence: string[];
  confidence: number; // 0-1
}

/**
 * Apply chain-of-thought reasoning to analyze a response
 * Verifies that logical steps are supported by evidence
 */
export const applyReasoning = (
  responseText: string,
  userInput: string, 
  conversationHistory: string[]
): {
  verifiedResponse: string;
  reasoningSteps: ReasoningStep[];
  isLogicallySound: boolean;
} => {
  console.log("REASONING: Applying chain-of-thought verification");
  
  // Break response into reasoning steps
  const steps = extractReasoningSteps(responseText);
  
  // Verify each step
  const verifiedSteps = steps.map(step => 
    verifyReasoningStep(step, userInput, conversationHistory)
  );
  
  // Check if response is logically sound
  const isLogicallySound = !verifiedSteps.some(step => step.confidence < 0.7);
  
  // If not logically sound, revise the response
  let verifiedResponse = responseText;
  if (!isLogicallySound) {
    verifiedResponse = reviseResponse(responseText, verifiedSteps);
  }
  
  return {
    verifiedResponse,
    reasoningSteps: verifiedSteps,
    isLogicallySound
  };
};

/**
 * Extract reasoning steps from a response
 * Breaks down claims and implied reasoning
 */
const extractReasoningSteps = (responseText: string): ReasoningStep[] => {
  const steps: ReasoningStep[] = [];
  
  // Split into sentences
  const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // For each sentence, identify if it's making a claim
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    
    // Skip very short sentences and questions
    if (trimmed.length < 15 || trimmed.endsWith("?")) continue;
    
    // Look for claims about the user or their situation
    if (/you|your|feel|feeling|experiencing|situation|issue|problem|concern|mentioned/i.test(trimmed)) {
      steps.push({
        claim: trimmed,
        evidence: [], // Will be filled during verification
        confidence: 1.0 // Initial confidence
      });
    }
  }
  
  return steps;
};

/**
 * Verify a reasoning step against available evidence
 */
const verifyReasoningStep = (
  step: ReasoningStep, 
  userInput: string, 
  conversationHistory: string[]
): ReasoningStep => {
  const { claim } = step;
  const evidence: string[] = [];
  
  // If the claim references what the user said
  if (/you (?:said|mentioned|told|expressed|shared|indicated)/i.test(claim)) {
    // Extract what user supposedly said
    const match = claim.match(/you (?:said|mentioned|told|expressed|shared|indicated)[^\w]*([\w\s]+)/i);
    if (match && match[1]) {
      const allegedStatement = match[1].trim().toLowerCase();
      
      // Check if this exists in conversation history
      let foundEvidence = false;
      for (const message of conversationHistory) {
        if (message.toLowerCase().includes(allegedStatement)) {
          evidence.push(`User message contains: "${allegedStatement}"`);
          foundEvidence = true;
          break;
        }
      }
      
      // If no evidence, reduce confidence
      if (!foundEvidence) {
        return {
          ...step,
          evidence: ['No supporting evidence found in conversation history'],
          confidence: 0.3 // Low confidence due to lack of evidence
        };
      }
    }
  }
  
  // If claim is about user's feelings
  if (/you (?:feel|feeling|experiencing|are)/i.test(claim)) {
    // Extract the feeling/state
    const match = claim.match(/you (?:feel|feeling|experiencing|are)[^\w]*([\w\s]+)/i);
    if (match && match[1]) {
      const allegedFeeling = match[1].trim().toLowerCase();
      
      // Check if user has expressed this
      let foundEvidence = false;
      if (userInput.toLowerCase().includes(allegedFeeling)) {
        evidence.push(`Current message contains: "${allegedFeeling}"`);
        foundEvidence = true;
      } else {
        // Check in recent history
        for (const message of conversationHistory.slice(-3)) {
          if (message.toLowerCase().includes(allegedFeeling)) {
            evidence.push(`Recent message contains: "${allegedFeeling}"`);
            foundEvidence = true;
            break;
          }
        }
      }
      
      // Adjust confidence based on evidence
      if (!foundEvidence) {
        // Less severe confidence reduction for inferences about feelings
        return {
          ...step,
          evidence: ['No direct evidence, appears to be an inference'],
          confidence: 0.6 // Moderate confidence - inference may be reasonable
        };
      }
    }
  }
  
  // Default case - if we reach here, the step seems reasonable
  if (evidence.length === 0) {
    evidence.push('No contradicting evidence found');
  }
  
  return {
    ...step,
    evidence,
    confidence: 0.9 // High confidence by default if nothing contradicts
  };
};

/**
 * Revise response based on verified reasoning steps
 */
const reviseResponse = (
  originalResponse: string, 
  verifiedSteps: ReasoningStep[]
): string => {
  let response = originalResponse;
  
  // Identify problematic steps
  const problematicSteps = verifiedSteps.filter(step => step.confidence < 0.7);
  
  // Replace problematic claims with more hedged language
  for (const step of problematicSteps) {
    const { claim } = step;
    
    // Create a more hedged version of the claim
    let replacementClaim: string;
    
    if (/you (?:said|mentioned|told)/i.test(claim)) {
      // Replace definitive statements about what user said
      replacementClaim = claim.replace(
        /you (?:said|mentioned|told|expressed)/i,
        "you may have indicated"
      );
    } else if (/you (?:feel|feeling|experiencing|are)/i.test(claim)) {
      // Replace definitive statements about feelings
      replacementClaim = claim.replace(
        /you (?:feel|feeling|experiencing|are)/i,
        "you might be feeling"
      );
    } else {
      // Generic hedging
      replacementClaim = `It seems like ${claim.toLowerCase()}`;
    }
    
    // Replace the problematic claim in the response
    response = response.replace(claim, replacementClaim);
  }
  
  return response;
};
