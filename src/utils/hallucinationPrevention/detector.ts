/**
 * Hallucination Detection System
 * 
 * Implements techniques from modern LLM hallucination prevention:
 * 1. Retrieval-Augmented Generation (RAG) approach
 * 2. Reasoning and fact checking
 * 3. Iterative querying and token-level analysis
 * 4. Natural Language Inference (NLI) verification
 */

import { getContextualMemory } from '../nlpProcessor';
import { retrieveRelevantMemories } from '../memory/memoryBank';
import { getFiveResponseMemory } from '../memory/fiveResponseMemory';
import { 
  HallucinationCheck,
  HallucinationFlag,
  HallucinationFlagType,
  HallucinationSeverity
} from '../../types/hallucinationPrevention';

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
  
  // Reduce confidence based on memory flags (most critical)
  confidenceScore -= memoryFlags.length * 0.25;
  
  // Check for logical errors and contradictions
  const logicalFlags = detectLogicalErrors(responseText, conversationHistory);
  flags.push(...logicalFlags);
  
  // Reduce confidence based on logical flags
  confidenceScore -= logicalFlags.length * 0.2;
  
  // Check for false continuity claims
  const continuityFlags = detectFalseContinuity(responseText, conversationHistory);
  flags.push(...continuityFlags);
  
  // Reduce confidence based on continuity flags
  confidenceScore -= continuityFlags.length * 0.3;
  
  // NEW: Detect token-level issues using probabilistic analysis
  const tokenFlags = detectTokenLevelIssues(responseText, userInput, conversationHistory);
  flags.push(...tokenFlags);
  
  // Reduce confidence based on token-level flags
  confidenceScore -= tokenFlags.length * 0.15;
  
  // NEW: Detect repeated content (a sign of model confusion)
  const repetitionFlags = detectRepeatedContent(responseText);
  flags.push(...repetitionFlags);
  
  // Reduce confidence based on repetition flags (very important)
  confidenceScore -= repetitionFlags.length * 0.35;
  
  // Bound confidence between 0 and 1
  confidenceScore = Math.max(0, Math.min(1, confidenceScore));
  
  // Determine if this should be flagged as hallucination
  const isHallucination = confidenceScore < 0.6 || 
                         flags.some(flag => flag.severity === 'high');
  
  // Generate token-level analysis result
  const tokenLevelAnalysis = generateTokenLevelAnalysis(responseText);
  
  return {
    content: responseText,
    confidenceScore,
    hallucination: isHallucination,
    flags,
    corrections: isHallucination ? generateCorrection(responseText, flags) : undefined,
    tokenLevelAnalysis // Include token analysis in the result
  };
};

/**
 * Detects references to memories that don't exist or contradict actual memories
 * Enhanced to be more sensitive to false memory references
 */
const detectFalseMemoryReferences = (
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
    if (memoryContext.dominantTopics.some(topic => 
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
 * Enhanced with stronger consistency checks
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
 * NEW: Detect token-level issues using probabilistic analysis
 * This is a simplified implementation of the token-level detection described in the research
 */
const detectTokenLevelIssues = (
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
 * NEW: Detect repeated content (a sign of model confusion)
 */
const detectRepeatedContent = (responseText: string): HallucinationFlag[] => {
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
 * Helper: Extract candidate entities from text
 * Very simplified NER - in a real implementation, use a proper NLP library
 */
const extractEntities = (text: string): string[] => {
  const entities: string[] = [];
  
  // Simple approach: extract capitalized phrases and potential entities
  const words = text.split(/\s+/);
  let currentEntity = '';
  
  for (const word of words) {
    // Clean up word
    const cleanWord = word.replace(/[.,;!?()]/g, '');
    
    // Skip short words and common stopwords
    if (cleanWord.length < 2 || isCommonWord(cleanWord)) {
      if (currentEntity) {
        entities.push(currentEntity.trim());
        currentEntity = '';
      }
      continue;
    }
    
    // Check if word begins with capital letter
    if (cleanWord.length > 0 && cleanWord[0] === cleanWord[0].toUpperCase()) {
      if (currentEntity) {
        currentEntity += ' ' + cleanWord;
      } else {
        currentEntity = cleanWord;
      }
    } else {
      if (currentEntity) {
        entities.push(currentEntity.trim());
        currentEntity = '';
      }
    }
  }
  
  // Add the last entity if there is one
  if (currentEntity) {
    entities.push(currentEntity.trim());
  }
  
  // Add dates, numbers, and other specific entities
  const datePattern = /\b(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}|\d{1,2}\/\d{1,2})\b/g;
  const dateMatches = text.match(datePattern) || [];
  entities.push(...dateMatches);
  
  // Add specific phrases that often lead to factual claims
  const specificPhrases = extractSpecificPhrases(text);
  entities.push(...specificPhrases);
  
  return [...new Set(entities)]; // Remove duplicates
};

/**
 * Helper: Is this entity likely a factual claim?
 */
const isLikelyFactualClaim = (entity: string): boolean => {
  // Names, dates, numbers, and specific entities are likely factual claims
  return (
    entity.length > 2 && 
    (
      /^\d+$/.test(entity) || // Pure number
      /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(entity) || // Date
      (entity[0] === entity[0].toUpperCase() && !isCommonWord(entity)) // Capitalized non-common word
    )
  );
};

/**
 * Helper: Common words check
 */
const isCommonWord = (word: string): boolean => {
  const lowerWord = word.toLowerCase();
  const commonWords = ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'and', 'but', 'or', 'the', 
    'a', 'an', 'is', 'am', 'are', 'was', 'were', 'will', 'have', 'had', 'has', 'this', 'that',
    'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their'];
  
  return commonWords.includes(lowerWord);
};

/**
 * Helper: Extract specific phrases that often lead to factual claims
 */
const extractSpecificPhrases = (text: string): string[] => {
  const phrases: string[] = [];
  
  // Extract phrases after "you mentioned" or similar
  const referencePattern = /(?:you mentioned|you told me|you said) (?:that|how|about)? ([\w\s]+?)(?:\.|\,|;|$)/gi;
  let match;
  
  while ((match = referencePattern.exec(text)) !== null) {
    if (match[1] && match[1].trim().length > 3) {
      phrases.push(match[1].trim());
    }
  }
  
  return phrases;
};

/**
 * Helper: Extract all n-gram phrases from text
 */
const extractPhrases = (text: string, minWords: number): string[] => {
  const phrases: string[] = [];
  const words = text.split(/\s+/);
  
  // Generate n-grams
  for (let n = minWords; n <= Math.min(8, words.length); n++) {
    for (let i = 0; i <= words.length - n; i++) {
      const phrase = words.slice(i, i + n).join(' ').toLowerCase();
      if (phrase.length > 10) { // Only consider substantial phrases
        phrases.push(phrase);
      }
    }
  }
  
  return phrases;
};

/**
 * Calculate string similarity using a hybrid approach
 */
const calculateStringSimilarity = (str1: string, str2: string): number => {
  // Quick length check
  if (Math.abs(str1.length - str2.length) > 0.5 * Math.max(str1.length, str2.length)) {
    return 0;
  }
  
  // For very short strings, use exact match
  if (str1.length < 5 || str2.length < 5) {
    return str1.toLowerCase() === str2.toLowerCase() ? 1 : 0;
  }
  
  // Tokenize and calculate word overlap
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  
  let matchCount = 0;
  for (const word of words1) {
    if (word.length > 2 && words2.includes(word)) {
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

/**
 * NEW: Generate token-level analysis for the response
 */
const generateTokenLevelAnalysis = (responseText: string) => {
  // In a real implementation, this would use a pre-trained model
  // This is a simplified placeholder version
  
  const tokens = responseText.split(/\s+/);
  const scores = Array(tokens.length).fill(1.0);
  
  // Flag tokens that might be problematic
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Risk indicators: numbers, dates, named entities
    if (/^\d+$/.test(token)) {
      scores[i] = 0.7; // Numbers are somewhat risky
    }
    
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(token)) {
      scores[i] = 0.6; // Dates are more risky
    }
    
    // Check for phrases that often indicate hallucination
    const riskPhrases = ['remember', 'mentioned', 'told', 'said', 'discussed'];
    if (riskPhrases.includes(token.toLowerCase())) {
      scores[i] = 0.5; // These tokens trigger more scrutiny
    }
  }
  
  return {
    tokens,
    scores
  };
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
  if (flags.some(f => f.type === 'logical_error' || f.type === 'contradiction')) {
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
 * Enhanced with handling for new detection methods
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
  
  // If this is a new conversation, be VERY cautious about memory claims
  const isNewConversation = conversationHistory.length <= 2;
  
  // Run full detection
  const hallucinationCheck = detectHallucinations(responseText, userInput, conversationHistory);
  
  // In new conversations, be extra strict about hallucinations
  const hallucinationThreshold = isNewConversation ? 0.7 : 0.6;
  
  if (hallucinationCheck.hallucination || 
      hallucinationCheck.confidenceScore < hallucinationThreshold ||
      (isNewConversation && /I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about/i.test(responseText))) {
    
    console.warn("HALLUCINATION DETECTED:", hallucinationCheck.flags);
    
    // Generate corrected response
    const correctedResponse = hallucinationCheck.corrections || responseText;
    
    // Final safety check for new conversations - remove ALL memory references
    let finalResponse = correctedResponse;
    if (isNewConversation) {
      finalResponse = finalResponse.replace(
        /(?:I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about|we've been focusing on) (?:that |how |about |your |having |feeling |experiencing |)([\w\s]+)/gi,
        "I hear you're dealing with $1"
      );
    }
    
    // Fix repeated sentences
    if (quickCheck.hasRepeatedSentences) {
      const sentences = finalResponse.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const uniqueSentences: string[] = [];
      
      // Keep only unique sentences
      for (const sentence of sentences) {
        if (!uniqueSentences.some(s => calculateStringSimilarity(s.toLowerCase(), sentence.toLowerCase()) > 0.7)) {
          uniqueSentences.push(sentence.trim());
        }
      }
      
      finalResponse = uniqueSentences.join(". ") + ".";
    }
    
    return {
      correctedResponse: finalResponse,
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
 * Enhanced with detection for repeated sentences
 */
const quickHallucinationCheck = (
  responseText: string,
  conversationHistory: string[]
): { potentialIssue: boolean; reason?: string; hasRepeatedSentences?: boolean } => {
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
  
  // Check for repeated sentences
  const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let hasRepeatedSentences = false;
  
  if (sentences.length >= 2) {
    for (let i = 0; i < sentences.length; i++) {
      for (let j = i + 1; j < sentences.length; j++) {
        const similarity = calculateStringSimilarity(
          sentences[i].toLowerCase(), 
          sentences[j].toLowerCase()
        );
        
        if (similarity > 0.7) {
          hasRepeatedSentences = true;
          return { 
            potentialIssue: true, 
            reason: 'Repeated sentences detected',
            hasRepeatedSentences: true
          };
        }
      }
    }
  }
  
  // Repetition check - quick scan for near-duplicate content
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
              reason: 'Potential repetition detected',
              hasRepeatedSentences: true
            };
          }
        }
      }
    }
  }
  
  // Check for excessive "I remember" phrases
  let rememberCount = 0;
  const rememberPattern = /I remember/gi;
  let match;
  while ((match = rememberPattern.exec(responseText)) !== null) {
    rememberCount++;
  }
  
  if (rememberCount > 1) {
    return { 
      potentialIssue: true, 
      reason: 'Multiple memory claims',
      hasRepeatedSentences: false
    };
  }
  
  return { potentialIssue: false, hasRepeatedSentences };
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
