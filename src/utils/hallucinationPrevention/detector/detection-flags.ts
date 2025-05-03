
/**
 * Hallucination Detection Flags
 * 
 * This module provides functions for checking specific types of hallucinations
 * in Roger's responses.
 */

import { MemoryPiece } from '../../memory/memoryBank';

/**
 * Check if response refers to non-existent past conversations
 */
export const checkFalsePastReference = (
  response: string, 
  conversationHistory: string[]
): boolean => {
  // Look for phrases indicating reference to past conversation
  const pastReferencePatterns = [
    /as (we|you) (mentioned|discussed|talked about) (earlier|before|previously)/i,
    /you (told|shared with) me (earlier|before|previously|last time)/i,
    /in our (previous|earlier|last|prior) (conversation|session|discussion)/i,
    /when we (last|previously) (spoke|talked|met)/i
  ];
  
  // If no references to past conversation, no false reference
  const hasPastReference = pastReferencePatterns.some(pattern => pattern.test(response));
  if (!hasPastReference) {
    return false;
  }
  
  // If this is the first message, any past reference is false
  if (conversationHistory.length <= 2) {
    return true;
  }
  
  // Otherwise, need more sophisticated checking
  // This would involve checking if the content actually matches past conversation
  // For now, a simplistic implementation
  return false;
};

/**
 * Check if response fabricates patient details
 */
export const checkFabricatedDetails = (
  response: string,
  knownPatientDetails: Record<string, any>
): boolean => {
  // Pattern for statements about the patient
  const patientDetailPatterns = [
    /you (are|seem) (a|an) ([a-z\s]+) (person|individual)/i,
    /you mentioned (you|your) ([a-z\s]+)/i,
    /your ([a-z\s]+) (that you mentioned|you talked about)/i,
    /as (a|an) ([a-z\s]+) (person|individual)/i
  ];
  
  // For each pattern, extract what might be fabricated details
  for (const pattern of patientDetailPatterns) {
    const matches = response.match(pattern);
    if (matches && matches.length > 2) {
      const potentialDetail = matches[2].toLowerCase().trim();
      
      // Check if this detail is known
      const isKnown = Object.entries(knownPatientDetails).some(([key, value]) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(potentialDetail);
        }
        return false;
      });
      
      // If not known, might be fabricated
      if (!isKnown) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Check if response claims non-existent capabilities
 */
export const checkCapabilityHallucination = (response: string): boolean => {
  const falseCapabilityPatterns = [
    /I (can|could) (diagnose|prescribe|treat|cure|heal)/i,
    /I('m| am) (a|an) (doctor|physician|psychiatrist|therapist|counselor|licensed)/i,
    /I('ll| will) (send|email|call|contact|schedule)/i,
    /(let me|I can) (order|arrange|book|schedule|reserve)/i,
    /I (can|could) (access|retrieve|look up) your (medical|health) (records|history|file)/i
  ];
  
  return falseCapabilityPatterns.some(pattern => pattern.test(response));
};

/**
 * Check if response hallucinates about past conversations
 */
export const checkConversationHallucination = (
  response: string,
  memories: MemoryPiece[]
): boolean => {
  // Phrases that claim specific content from past conversations
  const specificClaimPatterns = [
    /you (said|mentioned|told me) (that|about) "([^"]+)"/i,
    /you (said|mentioned|told me) (that|about) ([^,.]+)/i,
    /you (expressed|shared|discussed) ([^,.]+)/i,
    /according to (what|our|your) (previous|earlier) ([^,.]+)/i
  ];
  
  for (const pattern of specificClaimPatterns) {
    const matches = response.match(pattern);
    if (matches && matches.length > 3) {
      const claimedContent = matches[3].toLowerCase().trim();
      
      // Skip very short claims (less likely to be specific hallucinations)
      if (claimedContent.length < 5) continue;
      
      // Check if this claim exists in memories
      const matchFound = memories.some(memory => {
        if (memory.role === 'patient' && typeof memory.content === 'string') {
          return memory.content.toLowerCase().includes(claimedContent);
        }
        return false;
      });
      
      if (!matchFound) {
        // Potential hallucination detected
        return true;
      }
    }
  }
  
  return false;
};

// Implementation of the missing functions required by hallucination-detector.ts
export const detectFalseMemoryReferences = (
  response: string, 
  userInput: string, 
  conversationHistory: string[]
) => {
  // Basic implementation to satisfy import
  const flags = [];
  
  if (checkFalsePastReference(response, conversationHistory)) {
    flags.push({
      type: 'false_memory',
      severity: 'high',
      description: 'Response references non-existent past conversation'
    });
  }
  
  return flags;
};

export const detectLogicalErrors = (
  response: string, 
  conversationHistory: string[]
) => {
  // Basic implementation
  const flags = [];
  
  // Look for self-contradictions within the response
  if (/not .{1,30} but .{1,30} actually .{1,30} is/i.test(response)) {
    flags.push({
      type: 'logical_contradiction',
      severity: 'medium',
      description: 'Response contains logical contradiction'
    });
  }
  
  return flags;
};

export const detectTokenLevelIssues = (
  response: string,
  userInput: string,
  conversationHistory: string[]
) => {
  // Basic implementation
  const flags = [];
  
  // Check for incomplete sentences
  if (/\w+\s+\w+\s*[,;]?\s*$/i.test(response)) {
    flags.push({
      type: 'incomplete_sentence',
      severity: 'low',
      description: 'Response ends with incomplete sentence'
    });
  }
  
  return flags;
};

export const detectRepeatedContent = (response: string) => {
  // Basic implementation
  const flags = [];
  
  // Check for exact duplicate sentences
  const sentences = response.split(/(?<=[.!?])\s+/);
  const uniqueSentences = new Set(sentences);
  
  if (uniqueSentences.size < sentences.length) {
    flags.push({
      type: 'repetition',
      severity: 'medium',
      description: 'Response contains repeated sentences'
    });
  }
  
  return flags;
};

export const detectFalseContinuity = (
  response: string, 
  conversationHistory: string[]
) => {
  // Basic implementation
  const flags = [];
  
  // Check for false claims of ongoing conversation
  if (conversationHistory.length <= 2 && /as we've been discussing|continuing our conversation|as we were saying/i.test(response)) {
    flags.push({
      type: 'false_continuity',
      severity: 'high',
      description: 'Response falsely implies ongoing conversation'
    });
  }
  
  return flags;
};

// Export all flag functions
export default {
  checkFalsePastReference,
  checkFabricatedDetails,
  checkCapabilityHallucination,
  checkConversationHallucination,
  detectFalseMemoryReferences,
  detectLogicalErrors,
  detectTokenLevelIssues,
  detectRepeatedContent,
  detectFalseContinuity
};
