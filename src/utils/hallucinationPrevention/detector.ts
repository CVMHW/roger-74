
/**
 * Hallucination Detection System
 * 
 * Implements techniques from modern LLM hallucination prevention:
 * 1. Retrieval-Augmented Generation (RAG) approach
 * 2. Reasoning and fact checking
 * 3. Iterative querying
 */

import { getContextualMemory } from '../nlpProcessor';
import { retrieveRelevantMemories } from '../memory/memoryBank';
import { getFiveResponseMemory } from '../memory/fiveResponseMemory';

// Types for hallucination detection
export interface HallucinationCheck {
  content: string;
  confidenceScore: number; // 0-1 where 1 is high confidence it's NOT a hallucination
  hallucination: boolean;
  corrections?: string;
  flags: HallucinationFlag[];
}

export interface HallucinationFlag {
  type: 'memory_reference' | 'topic_reference' | 'timing_reference' | 
        'contradiction' | 'logical_error' | 'false_continuity' | 
        'mathematical_error' | 'factual_error';
  severity: 'low' | 'medium' | 'high';
  description: string;
}

/**
 * Checks for potential hallucinations in a response
 * Uses multi-faceted approach to detect different types of hallucinations
 */
export const detectHallucinations = (
  responseText: string,
  userInput: string, 
  conversationHistory: string[]
): HallucinationCheck => {
  console.log("HALLUCINATION DETECTOR: Analyzing response for potential hallucinations");
  
  const flags: HallucinationFlag[] = [];
  let confidenceScore = 1.0; // Start with high confidence
  
  // Check for memory references without actual memory
  const memoryFlags = detectFalseMemoryReferences(responseText, userInput, conversationHistory);
  flags.push(...memoryFlags);
  
  // Reduce confidence based on memory flags
  confidenceScore -= memoryFlags.length * 0.2;
  
  // Check for logical errors and contradictions
  const logicalFlags = detectLogicalErrors(responseText, conversationHistory);
  flags.push(...logicalFlags);
  
  // Reduce confidence based on logical flags (more impactful)
  confidenceScore -= logicalFlags.length * 0.3;
  
  // Check for false continuity claims
  const continuityFlags = detectFalseContinuity(responseText, conversationHistory);
  flags.push(...continuityFlags);
  
  // Reduce confidence based on continuity flags (most impactful)
  confidenceScore -= continuityFlags.length * 0.4;
  
  // Bound confidence between 0 and 1
  confidenceScore = Math.max(0, Math.min(1, confidenceScore));
  
  // Determine if this should be flagged as hallucination
  const isHallucination = confidenceScore < 0.6 || 
                         flags.some(flag => flag.severity === 'high');
  
  return {
    content: responseText,
    confidenceScore,
    hallucination: isHallucination,
    flags,
    corrections: isHallucination ? generateCorrection(responseText, flags) : undefined
  };
};

/**
 * Detects references to memories that don't exist or contradict actual memories
 */
const detectFalseMemoryReferences = (
  responseText: string,
  userInput: string,
  conversationHistory: string[]
): HallucinationFlag[] => {
  const flags: HallucinationFlag[] = [];
  
  // Pattern for memory references
  const memoryReferencePattern = /(?:I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about|we discussed|you've been|you indicated|we've been|you expressed|you shared) (?:that |how |about |your |having |feeling |experiencing |)([\w\s]+)/gi;
  
  // Extract all memory references
  let match;
  const memoryReferences: string[] = [];
  while ((match = memoryReferencePattern.exec(responseText)) !== null) {
    if (match[1] && match[1].trim().length > 0) {
      memoryReferences.push(match[1].trim().toLowerCase());
    }
  }
  
  // Skip check if no memory references found
  if (memoryReferences.length === 0) {
    return flags;
  }
  
  // Get actual memories
  const memoryContext = getContextualMemory(userInput);
  const relevantMemories = retrieveRelevantMemories(userInput);
  const fiveResponseMemory = getFiveResponseMemory();
  
  // Check if the conversation is new or very short
  const isNewConversation = conversationHistory.length <= 2;
  
  // This is a very severe hallucination case: claiming memories when conversation just started
  if (isNewConversation && memoryReferences.length > 0) {
    flags.push({
      type: 'false_continuity',
      severity: 'high',
      description: 'Response claims shared history when this appears to be a new conversation'
    });
    return flags; // Early return for this critical case
  }
  
  // Check each claimed memory against actual memories
  for (const reference of memoryReferences) {
    let foundMatch = false;
    
    // Check in contextual memory
    if (memoryContext.dominantTopics.some(topic => 
        reference.includes(topic.toLowerCase()))) {
      foundMatch = true;
      continue;
    }
    
    // Check in relevant memories
    if (relevantMemories.some(memory => 
        memory.content.toLowerCase().includes(reference))) {
      foundMatch = true;
      continue;
    }
    
    // Check in conversation history
    if (conversationHistory.some(message => 
        message.toLowerCase().includes(reference))) {
      foundMatch = true;
      continue;
    }
    
    // Check in 5ResponseMemory
    if (fiveResponseMemory.some(entry => 
        entry.role === 'patient' && 
        entry.content.toLowerCase().includes(reference))) {
      foundMatch = true;
      continue;
    }
    
    // If no match found, flag as hallucination
    if (!foundMatch) {
      flags.push({
        type: 'memory_reference',
        severity: 'high',
        description: `Response references "${reference}" which doesn't exist in conversation history`
      });
    }
  }
  
  return flags;
};

/**
 * Detects logical errors and contradictions within the response
 */
const detectLogicalErrors = (
  responseText: string,
  conversationHistory: string[]
): HallucinationFlag[] => {
  const flags: HallucinationFlag[] = [];
  
  // Check for self-contradictions within the response
  const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Check for repeated segments (a sign of LLM hallucination)
  const normalizedSentences = sentences.map(s => s.trim().toLowerCase());
  for (let i = 0; i < normalizedSentences.length; i++) {
    for (let j = i + 1; j < normalizedSentences.length; j++) {
      // If two non-adjacent sentences are very similar, it's likely a repetition hallucination
      const similarity = calculateStringSimilarity(normalizedSentences[i], normalizedSentences[j]);
      if (similarity > 0.8) {
        flags.push({
          type: 'logical_error',
          severity: 'medium',
          description: 'Response contains repetitive segments with nearly identical content'
        });
        break;
      }
    }
  }
  
  // Check for contradictory statements about client emotions
  const positiveEmotionPattern = /(?:you are|you're|you feel|you're feeling|you seem|you're seeming) (?:happy|good|great|excellent|positive|upbeat|content|joyful|excited)/i;
  const negativeEmotionPattern = /(?:you are|you're|you feel|you're feeling|you seem|you're seeming) (?:sad|depressed|anxious|upset|distressed|troubled|worried|concerned|stressed|down)/i;
  
  if (positiveEmotionPattern.test(responseText) && negativeEmotionPattern.test(responseText)) {
    flags.push({
      type: 'contradiction',
      severity: 'medium',
      description: 'Response contains contradictory statements about client emotions'
    });
  }
  
  // Check for illogical cause-effect relationships
  // This is a simplistic check that could be expanded
  if (responseText.includes("because you said") || responseText.includes("since you mentioned")) {
    const segments = responseText.split(/because you said|since you mentioned/i);
    if (segments.length > 1) {
      const claim = segments[1].split('.')[0].trim().toLowerCase();
      
      // Verify if the claim exists in conversation history
      const claimExists = conversationHistory.some(msg => msg.toLowerCase().includes(claim));
      
      if (!claimExists) {
        flags.push({
          type: 'factual_error',
          severity: 'high',
          description: `Response attributes "${claim}" to client without evidence in conversation history`
        });
      }
    }
  }
  
  return flags;
};

/**
 * Calculate string similarity using Levenshtein distance
 * Simplified version for detecting repetitions
 */
const calculateStringSimilarity = (str1: string, str2: string): number => {
  // For very different length strings, they're not similar
  if (Math.abs(str1.length - str2.length) > 10) {
    return 0;
  }
  
  // Simple word overlap check
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  let matchCount = 0;
  for (const word of words1) {
    if (word.length > 3 && words2.includes(word)) {
      matchCount++;
    }
  }
  
  // Calculate similarity score
  return matchCount / Math.max(words1.length, words2.length);
};

/**
 * Detect false continuity (claiming ongoing conversation when it's new)
 */
const detectFalseContinuity = (
  responseText: string,
  conversationHistory: string[]
): HallucinationFlag[] => {
  const flags: HallucinationFlag[] = [];
  
  // Check if conversation is just starting but response implies continuity
  const isNewConversation = conversationHistory.length <= 2;
  const continuityClaims = [
    /as we discussed/i,
    /continuing our conversation/i,
    /as we were saying/i,
    /coming back to/i,
    /we've been talking about/i,
    /to follow up on/i,
    /last time/i,
    /in our previous session/i,
    /we talked about this before/i
  ];
  
  if (isNewConversation) {
    for (const claim of continuityClaims) {
      if (claim.test(responseText)) {
        flags.push({
          type: 'false_continuity',
          severity: 'high',
          description: 'Response implies ongoing conversation when this appears to be new'
        });
        break;
      }
    }
  }
  
  // Check for timeline inconsistencies
  const timePatterns = [
    { pattern: /last week/i, timeRequired: 7 * 24 * 60 * 60 * 1000 },
    { pattern: /yesterday/i, timeRequired: 24 * 60 * 60 * 1000 },
    { pattern: /last month/i, timeRequired: 30 * 24 * 60 * 60 * 1000 }
  ];
  
  // This would require access to conversation timestamps
  // For now, just detect these phrases in new conversations
  if (isNewConversation) {
    for (const { pattern } of timePatterns) {
      if (pattern.test(responseText)) {
        flags.push({
          type: 'timing_reference',
          severity: 'high',
          description: 'Response references a past timeframe that doesn\'t match conversation history'
        });
        break;
      }
    }
  }
  
  return flags;
};

/**
 * Generate corrections for hallucinated content
 */
const generateCorrection = (
  responseText: string, 
  flags: HallucinationFlag[]
): string => {
  // For critical memory hallucinations, create appropriate replacements
  if (flags.some(f => f.type === 'memory_reference' && f.severity === 'high')) {
    // Replace memory claims with neutral statements
    let corrected = responseText.replace(
      /(?:I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about|we've been focusing on) (?:that |how |about |your |having |feeling |experiencing |)([\w\s]+)/gi,
      "What you're sharing about $1"
    );
    
    // Replace "we've discussed" patterns
    corrected = corrected.replace(
      /we(?:'ve| have) discussed ([\w\s]+)/gi,
      "you're bringing up $1"
    );
    
    // Remove timeline references
    corrected = corrected.replace(
      /(last time|previously|before|earlier|in our previous session)/gi,
      ""
    );
    
    return corrected;
  }
  
  // For repetition hallucinations, simplify the response
  if (flags.some(f => f.type === 'logical_error')) {
    const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const uniqueSentences: string[] = [];
    
    // Remove duplicative content
    for (const sentence of sentences) {
      const normalized = sentence.trim().toLowerCase();
      let isDuplicate = false;
      
      for (const existing of uniqueSentences) {
        if (calculateStringSimilarity(normalized, existing.toLowerCase()) > 0.7) {
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate) {
        uniqueSentences.push(sentence.trim());
      }
    }
    
    return uniqueSentences.join(". ") + ".";
  }
  
  return responseText;
};

/**
 * Main function to check and fix hallucinations
 */
export const checkAndFixHallucinations = (
  responseText: string,
  userInput: string,
  conversationHistory: string[]
): { 
  correctedResponse: string;
  wasHallucination: boolean;
  hallucinationDetails: HallucinationCheck | null;
} => {
  // Check if we need to run full hallucination detection
  // For efficiency, we only run detailed checks if we detect potential issues
  const quickCheck = quickHallucinationCheck(responseText, conversationHistory);
  
  // If quick check passes and it's not a new conversation, return original
  if (!quickCheck.potentialIssue && conversationHistory.length > 2) {
    return { 
      correctedResponse: responseText, 
      wasHallucination: false,
      hallucinationDetails: null
    };
  }
  
  // Run full detection
  const hallucinationCheck = detectHallucinations(responseText, userInput, conversationHistory);
  
  if (hallucinationCheck.hallucination) {
    console.warn("HALLUCINATION DETECTED:", hallucinationCheck.flags);
    
    // Generate corrected response
    const correctedResponse = hallucinationCheck.corrections || responseText;
    
    return {
      correctedResponse,
      wasHallucination: true,
      hallucinationDetails: hallucinationCheck
    };
  }
  
  return {
    correctedResponse: responseText,
    wasHallucination: false,
    hallucinationDetails: hallucinationCheck
  };
};

/**
 * Quick preliminary check for potential hallucinations
 * More efficient than running full detection on every response
 */
const quickHallucinationCheck = (
  responseText: string,
  conversationHistory: string[]
): { potentialIssue: boolean; reason?: string } => {
  // New conversation check - very strict about memory claims
  if (conversationHistory.length <= 2) {
    // In new conversations, ANY memory claim is suspect
    if (/I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about/i.test(responseText)) {
      return { 
        potentialIssue: true, 
        reason: 'Memory claims in new conversation' 
      };
    }
  }
  
  // Repetition check - quick scan for near-duplicate sentences
  const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length >= 3) { // Only check longer responses
    for (let i = 0; i < sentences.length; i++) {
      for (let j = i + 1; j < sentences.length; j++) {
        // If two sentences start with the same 10+ characters, flag for deeper inspection
        const minLength = Math.min(sentences[i].length, sentences[j].length);
        if (minLength > 15) {
          const commonStart = commonPrefix(sentences[i].toLowerCase(), sentences[j].toLowerCase());
          if (commonStart.length > 10) {
            return { 
              potentialIssue: true, 
              reason: 'Potential repetition detected' 
            };
          }
        }
      }
    }
  }
  
  return { potentialIssue: false };
};

/**
 * Find the common prefix of two strings
 */
const commonPrefix = (str1: string, str2: string): string => {
  let i = 0;
  const maxLen = Math.min(str1.length, str2.length);
  
  while (i < maxLen && str1[i] === str2[i]) {
    i++;
  }
  
  return str1.substring(0, i);
};
