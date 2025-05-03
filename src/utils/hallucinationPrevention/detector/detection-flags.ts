/**
 * Detection of different types of hallucination flags
 */

import { getContextualMemory } from '../../nlpProcessor';
import { retrieveRelevantMemories } from '../../memory/memoryBank';
import { getFiveResponseMemory } from '../../memory/fiveResponseMemory';
import { calculateStringSimilarity } from './similarity-utils';
import { extractPhrases, extractEntities, isLikelyFactualClaim } from './entity-extraction';

// Import the types from their correct location
import { HallucinationFlag } from '../../../types/hallucinationPrevention';

/**
 * Detects references to memories that don't exist or contradict actual memories
 * Enhanced to be more sensitive to false memory references
 */
export const detectFalseMemoryReferences = (
  responseText: string,
  userInput: string,
  conversationHistory: string[]
): HallucinationFlag[] => {
  const flags: HallucinationFlag[] = [];
  
  // Pattern for memory references - enhanced to catch more subtle references
  const memoryReferencePattern = /(?:I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about|we discussed|you've been|you indicated|we've been|you expressed|you shared|you've talked about|as you said|like you mentioned|from what you've shared) (?:that |how |about |your |having |feeling |experiencing |)([\w\s]+)/gi;
  
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
      description: 'Response claims shared history when this appears to be a new conversation',
      confidenceScore: 0.95
    });
    return flags; // Early return for this critical case
  }
  
  // Check for repeated memory references (a strong sign of hallucination)
  // Count occurrences of memory reference phrases
  let memoryPhraseCount = 0;
  const memoryPhrases = [
    "I remember", "you mentioned", "you told me", "you said", 
    "we discussed", "we talked about", "you've shared"
  ];
  
  for (const phrase of memoryPhrases) {
    const regex = new RegExp(phrase, 'gi');
    const matches = responseText.match(regex) || [];
    memoryPhraseCount += matches.length;
  }
  
  // If there are too many memory references, flag as suspicious
  if (memoryPhraseCount > 2) {
    flags.push({
      type: 'memory_reference',
      severity: 'high',
      description: `Response contains excessive memory references (${memoryPhraseCount} instances)`,
      confidenceScore: 0.9
    });
  }
  
  // Check each claimed memory against actual memories
  for (const reference of memoryReferences) {
    let foundMatch = false;
    let matchStrength = 0;
    
    // Check in contextual memory
    if (memoryContext.dominantTopics?.some(topic => 
        reference.includes(topic.toLowerCase()))) {
      matchStrength += 0.3;
    }
    
    // Check in relevant memories
    for (const memory of relevantMemories) {
      if (memory.content.toLowerCase().includes(reference)) {
        matchStrength += 0.5;
      }
    }
    
    // Check in conversation history with similarity scoring
    for (const message of conversationHistory) {
      const similarity = calculateStringSimilarity(reference, message.toLowerCase());
      matchStrength += similarity * 0.7; // Weight conversation history highly
    }
    
    // Check in 5ResponseMemory
    for (const entry of fiveResponseMemory) {
      if (entry.role === 'patient' && 
          entry.content.toLowerCase().includes(reference)) {
        matchStrength += 0.4;
      }
    }
    
    // Consider it a match if the combined evidence is strong enough
    foundMatch = matchStrength >= 0.6;
    
    // If no match found, flag as hallucination with appropriate severity
    if (!foundMatch) {
      flags.push({
        type: 'memory_reference',
        severity: matchStrength < 0.2 ? 'high' : matchStrength < 0.4 ? 'medium' : 'low',
        description: `Response references "${reference}" which doesn't exist in conversation history`,
        confidenceScore: 0.8 - matchStrength
      });
    }
  }
  
  return flags;
};

/**
 * Detects logical errors and contradictions within the response
 */
export const detectLogicalErrors = (
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
      // If two sentences are very similar, it's likely a repetition hallucination
      const similarity = calculateStringSimilarity(normalizedSentences[i], normalizedSentences[j]);
      if (similarity > 0.8) {
        flags.push({
          type: 'logical_error',
          severity: 'medium',
          description: 'Response contains repetitive segments with nearly identical content',
          confidenceScore: similarity
        });
        break;
      }
    }
  }
  
  // Check for contradictory statements about client emotions
  const emotionPairs = [
    { positive: /(?:happy|good|great|excellent|positive|upbeat|content|joyful|excited)/i, 
      negative: /(?:sad|depressed|anxious|upset|distressed|troubled|worried|concerned|stressed|down)/i },
    { positive: /(?:calm|relaxed|at ease|peaceful)/i, 
      negative: /(?:stressed|tense|anxious|agitated|worried|nervous)/i },
    { positive: /(?:confident|sure|certain|decisive)/i, 
      negative: /(?:unsure|uncertain|doubtful|hesitant|confused)/i }
  ];
  
  for (const pair of emotionPairs) {
    const positivePattern = new RegExp(`(?:you are|you're|you feel|you're feeling|you seem|you're seeming) (?:${pair.positive.source})`, 'i');
    const negativePattern = new RegExp(`(?:you are|you're|you feel|you're feeling|you seem|you're seeming) (?:${pair.negative.source})`, 'i');
    
    if (positivePattern.test(responseText) && negativePattern.test(responseText)) {
      flags.push({
        type: 'contradiction',
        severity: 'medium',
        description: 'Response contains contradictory statements about client emotions',
        confidenceScore: 0.85
      });
    }
  }
  
  // Check for illogical cause-effect relationships
  if (responseText.includes("because you said") || responseText.includes("since you mentioned")) {
    const segments = responseText.split(/because you said|since you mentioned/i);
    if (segments.length > 1) {
      const claim = segments[1].split('.')[0].trim().toLowerCase();
      
      // Verify if the claim exists in conversation history
      const claimExists = conversationHistory.some(msg => {
        const similarity = calculateStringSimilarity(claim, msg.toLowerCase());
        return similarity > 0.5;
      });
      
      if (!claimExists) {
        flags.push({
          type: 'factual_error',
          severity: 'high',
          description: `Response attributes "${claim}" to client without evidence in conversation history`,
          confidenceScore: 0.9
        });
      }
    }
  }
  
  return flags;
};

/**
 * Detect token-level issues using probabilistic analysis
 */
export const detectTokenLevelIssues = (
  responseText: string,
  userInput: string,
  conversationHistory: string[]
): HallucinationFlag[] => {
  const flags: HallucinationFlag[] = [];
  
  // Identify key entities in the response (simplified version)
  const entities = extractEntities(responseText);
  
  // For each entity, check if it exists in the conversation history
  for (const entity of entities) {
    if (entity.length < 3) continue; // Skip very short entities
    
    let foundInContext = false;
    
    // Check in user input
    if (userInput.toLowerCase().includes(entity.toLowerCase())) {
      foundInContext = true;
      continue;
    }
    
    // Check in conversation history
    for (const message of conversationHistory) {
      if (message.toLowerCase().includes(entity.toLowerCase())) {
        foundInContext = true;
        break;
      }
    }
    
    // If entity not found and it seems like a specific fact, flag it
    if (!foundInContext && isLikelyFactualClaim(entity)) {
      flags.push({
        type: 'token_level_error',
        severity: 'low',
        description: `Entity "${entity}" not found in conversation context`,
        tokensAffected: [entity],
        confidenceScore: 0.7
      });
    }
  }
  
  return flags;
};

/**
 * Detect repeated content (a sign of model confusion)
 */
export const detectRepeatedContent = (responseText: string): HallucinationFlag[] => {
  const flags: HallucinationFlag[] = [];
  
  // Check for exact repeated phrases (3+ words)
  const phrases = extractPhrases(responseText, 3);
  const phraseCounts: Record<string, number> = {};
  
  // Count phrase occurrences
  for (const phrase of phrases) {
    phraseCounts[phrase] = (phraseCounts[phrase] || 0) + 1;
  }
  
  // Flag phrases that repeat too often
  for (const [phrase, count] of Object.entries(phraseCounts)) {
    if (count > 1) {
      // The more times it repeats, the more severe
      const severity: HallucinationSeverity = count > 2 ? 'high' : 'medium';
      
      flags.push({
        type: 'logical_error',
        severity,
        description: `Phrase "${phrase}" repeats ${count} times, suggesting model confusion`,
        confidenceScore: 0.8 + (count * 0.05) // Higher confidence with more repetitions
      });
    }
  }
  
  // Check for repeated sentences with high similarity
  const sentences = responseText.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
  
  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      const similarity = calculateStringSimilarity(sentences[i], sentences[j]);
      
      if (similarity > 0.7) {
        flags.push({
          type: 'contradiction',
          severity: similarity > 0.9 ? 'high' : 'medium',
          description: `Nearly identical sentences detected, suggesting repetition loop`,
          confidenceScore: similarity
        });
      }
    }
  }
  
  return flags;
};

/**
 * Detect false continuity (claiming ongoing conversation when it's new)
 */
export const detectFalseContinuity = (
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
    /we talked about this before/i,
    /as I mentioned earlier/i,
    /from our previous discussion/i,
    /as we've been exploring/i
  ];
  
  if (isNewConversation) {
    for (const claim of continuityClaims) {
      if (claim.test(responseText)) {
        flags.push({
          type: 'false_continuity',
          severity: 'high',
          description: 'Response implies ongoing conversation when this appears to be new',
          confidenceScore: 0.95
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
          description: 'Response references a past timeframe that doesn\'t match conversation history',
          confidenceScore: 0.9
        });
        break;
      }
    }
  }
  
  return flags;
};
