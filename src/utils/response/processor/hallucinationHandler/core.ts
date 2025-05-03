
/**
 * Core hallucination handler
 * 
 * Processes responses to prevent hallucinations
 */

import { isSmallTalk, isIntroduction } from '../../../masterRules';

/**
 * Handle potential hallucinations in responses
 */
export const handlePotentialHallucinations = (
  response: string,
  userInput: string,
  conversationHistory: string[] = []
): { 
  requiresStrictPrevention: boolean; 
  processedResponse: string;
} => {
  // Check if this is an everyday social situation
  const isEverydaySituation = /trip(ped)?|spill(ed)?|embarrass(ing|ed)?|awkward|class|teacher|student|bar|drink|fall|fell|stumble|social|party|date/i.test(userInput);
  
  // Check if resistance to philosophical approach
  const hasResistance = conversationHistory.some(msg => 
    /what\?|all|that's all|just happened|it was just|how does.*reflect|are you insinuating|not that deep|too much|simple|regular|come on|get real/i.test(msg)
  );
  
  // Also check master rules for small talk and introductions
  const isSmallTalkContext = isSmallTalk(userInput);
  const isIntroductionContext = isIntroduction(userInput);
  
  // Handle social situations specially
  if (isEverydaySituation || isSmallTalkContext || (hasResistance && conversationHistory.length > 1)) {
    return handleEverydaySituation(response, userInput);
  }
  
  // For early conversation, be extra cautious
  const isEarlyConversation = conversationHistory.length < 3;
  if (isEarlyConversation) {
    return handleEarlyConversation(response, userInput);
  }
  
  // Check for health hallucinations
  if (containsHealthClaims(response)) {
    return handleHealthHallucination(response);
  }
  
  // Check for memory references
  if (hasMemoryReference(response) && conversationHistory.length < 5) {
    return handleMemoryHallucinations(response, conversationHistory);
  }
  
  // Check for repeated content
  if (hasRepeatedContent(response)) {
    return {
      requiresStrictPrevention: true,
      processedResponse: fixRepeatedContent(response)
    };
  }
  
  // No issues detected
  return {
    requiresStrictPrevention: false,
    processedResponse: response
  };
};

/**
 * Handle everyday social situations
 */
const handleEverydaySituation = (
  response: string,
  userInput: string
): { requiresStrictPrevention: boolean; processedResponse: string } => {
  // For tripping in class/social embarrassment situations
  if (/trip(ped)?|fall|fell|stumble/i.test(userInput)) {
    if (/class|teacher|student|presentation/i.test(userInput)) {
      return {
        requiresStrictPrevention: true,
        processedResponse: "That sounds pretty embarrassing. Most people have had moments like that in front of others. How did the class react?"
      };
    }
    return {
      requiresStrictPrevention: true,
      processedResponse: "Those moments can feel so awkward! Everyone has those embarrassing moments. What happened next?"
    };
  }
  
  // For spilling situations
  if (/spill(ed)?/i.test(userInput)) {
    return {
      requiresStrictPrevention: true,
      processedResponse: "Spilling something can definitely feel awkward in the moment. What happened next?"
    };
  }
  
  // For generic embarrassing situations
  if (/embarrass(ing|ed)?|awkward/i.test(userInput)) {
    return {
      requiresStrictPrevention: true,
      processedResponse: "Embarrassing moments like that can feel much bigger to us than they do to others. How are you feeling about it now?"
    };
  }
  
  // Check if the response has meaning/logotherapy content for everyday situation
  if (/meaning|purpose|values|deeper|connection to|life patterns|existential|broader perspective/i.test(response)) {
    // Remove philosophical content, make more conversational
    return {
      requiresStrictPrevention: true,
      processedResponse: "That sounds difficult. Would you like to tell me more about what happened?"
    };
  }
  
  // If response seems appropriate for everyday situation, keep it
  return {
    requiresStrictPrevention: false,
    processedResponse: response
  };
};

/**
 * Handle early conversation
 */
const handleEarlyConversation = (
  response: string,
  userInput: string
): { requiresStrictPrevention: boolean; processedResponse: string } => {
  return {
    requiresStrictPrevention: false,
    processedResponse: fixFalseMemoryReferences(response)
  };
};

/**
 * Check if response contains health claims
 */
const containsHealthClaims = (response: string): boolean => {
  return /research shows|studies indicate|clinically proven|medical research|health benefits|diagnosis|treatment plan|symptoms indicate/i.test(response);
};

/**
 * Handle health-related hallucinations
 */
export const handleHealthHallucination = (
  response: string
): { requiresStrictPrevention: boolean; processedResponse: string } => {
  // Replace specific health claims with appropriate language
  let processed = response
    .replace(/research shows|studies indicate|clinically proven/gi, "some people find")
    .replace(/treatment for this condition|medical treatment/gi, "professional support")
    .replace(/diagnosis|diagnose/gi, "professional assessment")
    .replace(/symptoms indicate|symptoms of/gi, "experiences can be related to");
  
  // Add disclaimer if needed
  if (processed === response) {
    processed = "I'm not qualified to provide medical advice, but I'm here to listen and support you. " + response;
  }
  
  return {
    requiresStrictPrevention: true,
    processedResponse: processed
  };
};

/**
 * Check if response has repeated content
 */
export const hasRepeatedContent = (response: string): boolean => {
  // Check for repeated phrases
  const phrases = response.split(/[.!?]\s+/);
  const uniquePhrases = new Set(phrases.map(p => p.toLowerCase().trim()));
  
  // If there are significantly fewer unique phrases than total phrases, repetition detected
  return uniquePhrases.size < phrases.length * 0.7;
};

/**
 * Fix repeated content in response
 */
export const fixRepeatedContent = (response: string): string => {
  // Split into sentences
  const sentences = response.split(/([.!?])\s+/).filter(s => s.trim().length > 0);
  const uniqueSentences = [];
  const seen = new Set();
  
  // Keep only unique sentences (with punctuation)
  for (let i = 0; i < sentences.length; i++) {
    const current = sentences[i];
    const next = i + 1 < sentences.length ? sentences[i + 1] : "";
    const combined = current + (next.length === 1 ? next : "");
    
    const normalized = combined.toLowerCase().trim();
    if (!seen.has(normalized) || normalized.length <= 1) {
      uniqueSentences.push(combined);
      seen.add(normalized);
    }
    
    // Skip the punctuation we just added
    if (next.length === 1) i++;
  }
  
  // Combine sentences back together
  return uniqueSentences.join(" ");
};

/**
 * Fix dangerous repetition patterns
 */
export const fixDangerousRepetitionPatterns = (response: string): string => {
  // Find repeated patterns across sentences
  const sentences = response.split(/[.!?]\s+/);
  
  // If not enough sentences to check patterns, return original
  if (sentences.length < 3) return response;
  
  // Check for recurring phrases across sentences
  const phraseCount = {};
  sentences.forEach(sentence => {
    // Extract key phrases (3+ word combinations)
    const words = sentence.toLowerCase().split(/\s+/);
    for (let i = 0; i <= words.length - 3; i++) {
      const phrase = words.slice(i, i + 3).join(" ");
      if (phrase.length > 10) { // Only track substantial phrases
        phraseCount[phrase] = (phraseCount[phrase] || 0) + 1;
      }
    }
  });
  
  // Identify problematic repeating phrases
  const repeatedPhrases = Object.entries(phraseCount)
    .filter(([phrase, count]) => count > 1)
    .map(([phrase]) => phrase);
  
  // If no problematic repetition, return original
  if (repeatedPhrases.length === 0) return response;
  
  // Otherwise, fix the repetition by keeping just one instance of each repeated phrase
  let fixed = response;
  repeatedPhrases.forEach(phrase => {
    // Replace second and subsequent occurrences
    const pattern = new RegExp(`(.*${phrase}.*?)(?:${phrase})`, "gi");
    fixed = fixed.replace(pattern, "$1");
  });
  
  return fixed;
};

/**
 * Fix false memory references
 */
export const fixFalseMemoryReferences = (response: string): string => {
  return response
    .replace(/you (mentioned|said|told me) that/gi, "it sounds like")
    .replace(/earlier you (mentioned|said|indicated)/gi, "you just shared")
    .replace(/as you mentioned/gi, "from what you're saying")
    .replace(/we (discussed|talked about)/gi, "regarding")
    .replace(/I remember you saying/gi, "I understand")
    .replace(/from our previous conversation/gi, "from what you've shared");
};

// Export missing functions imported by other files
export const handleMemoryHallucinations = (
  response: string,
  conversationHistory: string[] = []
): { requiresStrictPrevention: boolean; processedResponse: string } => {
  // For early conversations, remove memory references
  if (conversationHistory.length < 3 && hasMemoryReference(response)) {
    return {
      requiresStrictPrevention: true,
      processedResponse: fixFalseMemoryReferences(response)
    };
  }
  
  return { requiresStrictPrevention: false, processedResponse: response };
};

/**
 * Check if response contains memory references
 */
const hasMemoryReference = (response: string): boolean => {
  return /you (mentioned|said|told me|indicated)|earlier you|previously you|we (discussed|talked about)|I remember|as you (mentioned|said|noted)|we've been/i.test(response);
};

// Fix the type issue
const isBeyondThreshold = (value: number | unknown, threshold: number): boolean => {
  if (typeof value !== 'number') return false;
  return value > threshold;
};
