
/**
 * Detection flags for hallucination prevention
 */

import { HallucinationFlag } from './detector/types';
import vectorDB from './vectorDatabase';

/**
 * Detect false memory references in early conversation
 */
export const detectFalseMemoryReferences = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): HallucinationFlag[] => {
  const flags: HallucinationFlag[] = [];
  
  // Early conversation detection
  const isEarlyConversation = conversationHistory.length <= 2;
  
  if (isEarlyConversation) {
    // Check for "memory" references that imply previous conversation
    const memoryPatterns = [
      /you (mentioned|said|told me) (before|earlier|previously)/i,
      /as you (mentioned|said|told me) (before|earlier|previously)/i,
      /you('ve| have) (told|said to) me (before|earlier|previously)/i,
      /when we (talked|spoke|discussed) (about|earlier|before|previously)/i,
      /as we (discussed|talked about|covered) (before|earlier|previously)/i,
      /from our (previous|earlier|last) (conversation|discussion|session)/i,
      /in our (previous|earlier|last) (conversation|discussion|session)/i,
      /when you (told|shared with) me (before|earlier|previously)/i
    ];
    
    for (const pattern of memoryPatterns) {
      if (pattern.test(responseText)) {
        flags.push({
          type: 'false_memory',
          severity: 'high',
          description: 'False reference to previous conversation',
          confidence: 0.95
        });
        break;
      }
    }
  }
  
  return flags;
};

/**
 * Detect logical errors in the response
 */
export const detectLogicalErrors = (
  responseText: string,
  conversationHistory: string[] = []
): HallucinationFlag[] => {
  const flags: HallucinationFlag[] = [];
  
  // Check for self-contradictions
  const contradictionPatterns = [
    /I (don't|do not) think .{1,50}? I think/i,
    /I think .{1,50}? I (don't|do not) think/i,
    /It (isn't|is not) .{1,50}? It is/i,
    /It is .{1,50}? It (isn't|is not)/i,
    /You (aren't|are not) .{1,50}? You are/i,
    /You are .{1,50}? You (aren't|are not)/i
  ];
  
  for (const pattern of contradictionPatterns) {
    if (pattern.test(responseText)) {
      flags.push({
        type: 'logical_contradiction',
        severity: 'medium',
        description: 'Logical contradiction detected',
        confidence: 0.85
      });
      break;
    }
  }
  
  return flags;
};

/**
 * Detect token-level issues
 */
export const detectTokenLevelIssues = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): HallucinationFlag[] => {
  const flags: HallucinationFlag[] = [];
  
  // Check for fabricated context
  const fabricatedContextPatterns = [
    /in your (message|note|post)/i,
    /in your (situation|circumstance)/i,
    /your (situation|circumstance) with/i,
    /you've been (going through|experiencing|dealing with)/i,
    /your (experience|difficulty) with/i
  ];
  
  for (const pattern of fabricatedContextPatterns) {
    if (pattern.test(responseText) && !userInput.includes(pattern.source)) {
      flags.push({
        type: 'fabricated_context',
        severity: 'medium',
        description: 'Fabricated context not mentioned by user',
        confidence: 0.8
      });
      break;
    }
  }
  
  // Check for cutoff thoughts - indicators of hallucinated tokens
  const cutoffPatterns = [
    /^(?:\.{3}|\w+\.{3})/,
    /\b\w+\.{3}\s+[A-Z]/,
    /\b\w+\.{3}$/
  ];
  
  for (const pattern of cutoffPatterns) {
    if (pattern.test(responseText)) {
      flags.push({
        type: 'token_cutoff',
        severity: 'low',
        description: 'Cutoff thought indicating token-level hallucination',
        confidence: 0.7
      });
      break;
    }
  }
  
  return flags;
};

/**
 * Detect repeated content
 */
export const detectRepeatedContent = (responseText: string): HallucinationFlag[] => {
  const flags: HallucinationFlag[] = [];
  
  // Check for direct phrase repetition
  const sentences = responseText.split(/[.!?]\s+/);
  const processedSentences = sentences.map(s => s.toLowerCase().trim());
  
  // Check for repeated phrases (exact matches)
  for (let i = 0; i < processedSentences.length; i++) {
    if (processedSentences[i].length < 5) continue; // Skip short phrases
    
    for (let j = i + 1; j < processedSentences.length; j++) {
      if (processedSentences[i] === processedSentences[j]) {
        flags.push({
          type: 'repetition',
          severity: 'high',
          description: 'Exact sentence repetition detected',
          confidence: 0.9
        });
        return flags; // Return after finding one instance
      }
    }
  }
  
  // Check for common hallucination patterns with repetition
  const repetitionPatterns = [
    /(I hear (you'?re|you are) dealing with).*(I hear (you'?re|you are) dealing with)/i,
    /(I remember (you|your|we)).*(I remember (you|your|we))/i,
    /(you (mentioned|said|told me)).*(you (mentioned|said|told me))/i,
    /((I hear|It sounds like) you('re| are) (dealing with|feeling)).*((I hear|It sounds like) you('re| are))/i,
    /(I understand (you'?re|you are|your)).*(I understand (you'?re|you are|your))/i,
    /(It seems (you'?re|you are|your)).*(It seems (you'?re|you are|your))/i
  ];
  
  for (const pattern of repetitionPatterns) {
    if (pattern.test(responseText)) {
      flags.push({
        type: 'repetition_pattern',
        severity: 'high',
        description: 'Common repetition hallucination pattern detected',
        confidence: 0.85
      });
      return flags;
    }
  }
  
  return flags;
};

/**
 * Detect false continuity claims
 */
export const detectFalseContinuity = (
  responseText: string,
  conversationHistory: string[] = []
): HallucinationFlag[] => {
  const flags: HallucinationFlag[] = [];
  
  // Check if this appears to be a different topic than previously discussed
  if (conversationHistory.length > 0) {
    // If conversation just started
    if (conversationHistory.length <= 2) {
      const continuityPatterns = [
        /we've been discussing/i,
        /we've been talking about/i,
        /continuing our discussion/i,
        /as we were saying/i,
        /as I mentioned earlier/i
      ];
      
      for (const pattern of continuityPatterns) {
        if (pattern.test(responseText)) {
          flags.push({
            type: 'false_continuity',
            severity: 'high',
            description: 'False reference to ongoing discussion in a new conversation',
            confidence: 0.9
          });
          break;
        }
      }
    }
  }
  
  return flags;
};

/**
 * Check vector database for similar content to verify claims
 * This can help detect fabricated information
 */
export const checkVectorVerification = async (
  responseText: string,
  userInput: string
): Promise<HallucinationFlag[]> => {
  const flags: HallucinationFlag[] = [];
  
  try {
    // Check if vector database is available
    if (!vectorDB.hasCollection('factual_knowledge')) {
      return flags;
    }
    
    // Extract claims from the response
    // This is a simplified implementation - in real systems, this would use NLP to extract claims
    const claims = responseText.split('. ').filter(claim => 
      claim.length > 10 && 
      /\b(is|are|was|were|has|have|had|can|could|will|would|should)\b/i.test(claim)
    );
    
    if (claims.length === 0) {
      return flags;
    }
    
    // Check each claim against the vector database
    for (const claim of claims) {
      // Generate embedding for the claim
      const claimVector = await generateSimpleEmbedding(claim);
      
      // Search for similar content
      const results = await vectorDB.getCollection('factual_knowledge').search(claimVector, 1);
      
      // If no similar content or low similarity score, flag as potential fabrication
      if (results.length === 0 || results[0].score < 0.7) {
        flags.push({
          type: 'unverified_claim',
          severity: 'medium',
          description: 'Claim not verified by knowledge base',
          confidence: 0.75
        });
      }
    }
  } catch (error) {
    console.error("Error in vector verification:", error);
    // Continue without adding flags
  }
  
  return flags;
};

/**
 * Simple embedding function - would be replaced with a real embedding model
 * This is just for demo purposes and is duplicated from retrieval.ts
 */
const generateSimpleEmbedding = async (text: string): Promise<number[]> => {
  // In production, this would use a real embedding model
  // For now, create a pseudorandom but deterministic vector based on the text
  const vector = new Array(128).fill(0);
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    vector[i % vector.length] += charCode / 255;
  }
  
  // Normalize
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => val / magnitude);
};
