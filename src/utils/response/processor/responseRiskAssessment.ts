
/**
 * Response Risk Assessment
 * 
 * Evaluates responses for various risk factors and determines if they should be
 * discarded rather than sent to users. This implements the "self-deletion" program
 * to prevent problematic responses from reaching patients.
 */

import { detectHarmfulRepetitions } from './repetitionPrevention';

/**
 * Check if a response is risky and should be discarded
 */
export const isResponseRisky = (response: string): boolean => {
  // Skip check for very short responses
  if (!response || response.length < 10) {
    return false;
  }
  
  // 1. Check for dangerous repetition patterns - HIGH WEIGHT
  const repetitionCheck = detectHarmfulRepetitions(response);
  if (repetitionCheck.hasRepetition && repetitionCheck.repetitionScore > 0.8) {
    console.log("RISK: High repetition score detected");
    return true;
  }
  
  // 2. Check for other dangerous patterns
  if (hasRiskyPattern(response)) {
    console.log("RISK: Dangerous pattern detected");
    return true;
  }
  
  // 3. Check for nonsensical language
  if (isNonsensical(response)) {
    console.log("RISK: Nonsensical language detected");
    return true;
  }
  
  // 4. Check for identity issues (where Roger seems confused about who he is)
  if (hasIdentityConfusion(response)) {
    console.log("RISK: Identity confusion detected");
    return true;
  }
  
  return false;
};

/**
 * Determine if a response should be deleted before any processing
 * This is a more aggressive check for obviously problematic cases
 */
export const shouldDeleteResponse = (response: string, userInput: string): boolean => {
  // Skip check for very short responses
  if (!response || response.length < 10) {
    return false;
  }
  
  // Check for severe repetition issues
  if (/(.{15,})\1{2,}/i.test(response)) {
    console.log("SEVERE RISK: Extreme repetition pattern detected");
    return true;
  }
  
  // Check for AI hallucination markers
  if (/as an (AI|artificial intelligence|language model|chatbot|assistant)/gi.test(response)) {
    console.log("SEVERE RISK: AI identity confusion detected");
    return true;
  }
  
  // Check for anti-patterns (nonsensical combinations)
  const antiPatterns = [
    /Based on.*Based on.*Based on/i,
    /I hear.*I hear.*I hear/i,
    /from what.*from what.*from what/i,
    /you mentioned.*you mentioned.*you mentioned/i,
    /I understand.*I understand.*I understand/i
  ];
  
  for (const pattern of antiPatterns) {
    if (pattern.test(response)) {
      console.log(`SEVERE RISK: Extreme anti-pattern detected: ${pattern}`);
      return true;
    }
  }
  
  // NEW: Calculate repetition risk using a logarithmic scale
  const repetitionRisk = calculateRepetitionRisk(response);
  if (repetitionRisk > 0.75) {
    console.log(`SEVERE RISK: High repetition risk score: ${repetitionRisk.toFixed(2)}`);
    return true;
  }
  
  return false;
};

/**
 * Check if response has risky patterns
 */
const hasRiskyPattern = (response: string): boolean => {
  const riskyPatterns = [
    // Doubled introductory phrases
    /Based on what you're sharing, Based on what/i,
    /I hear what you're sharing, I hear what/i,
    /From what you've shared, From what/i,
    
    // Doubled emotion assessment
    /I hear you're feeling ([a-z]+), I hear you're feeling/i,
    /It sounds like you're feeling ([a-z]+), It sounds like/i,
    
    // Nonsensical patterns
    /you mentioned that you may have indicated/i,
    /you may have indicated just a/i,
    /dealing with you may have indicated/i,
    
    // Identity confusion
    /I am an AI/i,
    /I don't have (personal|real|actual) experiences/i,
    /I cannot (feel|experience)/i
  ];
  
  return riskyPatterns.some(pattern => pattern.test(response));
};

/**
 * Check if response has nonsensical language
 */
const isNonsensical = (response: string): boolean => {
  // Check for sentence boundary issues
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Check each sentence for length and structure
  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/);
    
    // Flag extremely short or long sentences
    if ((words.length < 3 && sentence.length > 10) || words.length > 60) {
      return true;
    }
    
    // Check for unusual word repeats (more than 3 times)
    const wordCounts: Record<string, number> = {};
    for (const word of words) {
      if (word.length > 3) { // Only check meaningful words
        wordCounts[word] = (wordCounts[word] || 0) + 1;
        if (wordCounts[word] > 3) return true;
      }
    }
  }
  
  return false;
};

/**
 * Check for identity confusion
 */
const hasIdentityConfusion = (response: string): boolean => {
  const identityConfusionPatterns = [
    /as an AI/i,
    /I am a (language model|machine learning model|computer program|bot|chatbot)/i,
    /I don't have (personal|real|actual|human) (experiences|feelings|emotions|opinions)/i,
    /I('m| am) not (capable of|able to) (having|experiencing|feeling)/i,
    /as an artificial intelligence/i
  ];
  
  return identityConfusionPatterns.some(pattern => pattern.test(response));
};

/**
 * Calculate repetition risk using logarithmic formula
 * This provides a risk score between 0-1 based on repetition patterns
 */
const calculateRepetitionRisk = (response: string): number => {
  // Skip calculation for short responses
  if (response.length < 50) return 0;
  
  // Break response into chunks
  const chunks: string[] = [];
  const words = response.split(/\s+/);
  
  // Create sliding window chunks (n-grams)
  for (let n = 3; n <= 7; n++) {
    if (words.length >= n) {
      for (let i = 0; i <= words.length - n; i++) {
        chunks.push(words.slice(i, i + n).join(' ').toLowerCase());
      }
    }
  }
  
  // Count chunk occurrences
  const chunkCounts: Record<string, number> = {};
  let duplicateCount = 0;
  let totalChunks = 0;
  
  for (const chunk of chunks) {
    if (chunk.length > 10) { // Only count meaningful chunks
      chunkCounts[chunk] = (chunkCounts[chunk] || 0) + 1;
      if (chunkCounts[chunk] > 1) duplicateCount++;
      totalChunks++;
    }
  }
  
  // Calculate risk score using logarithmic function
  // This creates a curve that rises quickly with initial repetitions
  // but levels off for very repetitive content
  if (totalChunks === 0) return 0;
  
  const repetitionRatio = duplicateCount / totalChunks;
  const logisticRiskScore = 1 / (1 + Math.exp(-10 * (repetitionRatio - 0.3)));
  
  return Math.min(1, logisticRiskScore);
};
