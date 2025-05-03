
/**
 * Early Conversation Handler
 * 
 * Special handling for the first 1-3 messages to prevent hallucinations
 * during the critical initial patient interaction (first 30s-60s)
 */

import { MemoryItem } from '../types';
import { getConversationMessageCount } from '../memoryController';

// Constants
const MAX_EARLY_CONVERSATION_MESSAGES = 3;
const EARLY_CONVERSATION_IMPORTANCE = 0.9; // Higher importance for initial messages

/**
 * Check if current conversation is in early stage
 */
export const isEarlyConversation = (): boolean => {
  const messageCount = getConversationMessageCount();
  return messageCount <= MAX_EARLY_CONVERSATION_MESSAGES;
};

/**
 * Apply special handling for early conversation memory
 */
export const applyEarlyConversationHandling = (
  item: MemoryItem
): MemoryItem => {
  if (!isEarlyConversation()) {
    return item;
  }

  console.log("EARLY CONVERSATION: Applying special memory handling");
  
  // Increase importance for early messages
  const enhancedItem: MemoryItem = {
    ...item,
    importance: Math.max(item.importance || 0, EARLY_CONVERSATION_IMPORTANCE),
    metadata: {
      ...item.metadata,
      earlyConversation: true,
      verificationLevel: 'high'
    }
  };
  
  return enhancedItem;
};

/**
 * Get verification constraints for early conversation responses
 */
export const getEarlyConversationConstraints = (): Record<string, any> => {
  return {
    allowMemoryReferences: false,
    requireExplicitGrounding: true,
    maxConfidenceThreshold: 0.95,
    applyCautionaryPhrasing: true
  };
};

/**
 * Detect statements that would cause hallucinations in early conversation
 * Focuses on continuity claims, memory references, and relationship building that's premature
 */
export const detectRiskyEarlyStatements = (responseText: string): { 
  isRisky: boolean; 
  reason?: string 
} => {
  // Patterns that suggest false continuity/familiarity in early conversation
  const riskPatterns = [
    {
      pattern: /as (we've|we have) discussed/i,
      reason: "False continuity claim"
    },
    {
      pattern: /we've been (talking|discussing|working on)/i,
      reason: "False ongoing relationship claim"
    },
    {
      pattern: /(last time|previous session|earlier today|when we last spoke)/i,
      reason: "False prior session reference"
    },
    {
      pattern: /you mentioned earlier that/i,
      reason: "Potentially false memory reference"
    },
    {
      pattern: /continuing our (conversation|discussion|work) on/i,
      reason: "False continuity claim"
    }
  ];
  
  for (const {pattern, reason} of riskPatterns) {
    if (pattern.test(responseText)) {
      return { isRisky: true, reason };
    }
  }
  
  return { isRisky: false };
};

/**
 * Fix risky early conversation statements
 */
export const fixRiskyEarlyStatements = (responseText: string): string => {
  // Replace false continuity with appropriate early-conversation phrasing
  let fixedResponse = responseText
    .replace(/as (we've|we have) discussed/gi, "based on what you've shared")
    .replace(/we've been (talking|discussing|working on)/gi, "you mentioned")
    .replace(/(last time|previous session|earlier today|when we last spoke)/gi, "just now")
    .replace(/you mentioned earlier that/gi, "you mentioned that")
    .replace(/continuing our (conversation|discussion|work) on/gi, "regarding");
  
  return fixedResponse;
};
