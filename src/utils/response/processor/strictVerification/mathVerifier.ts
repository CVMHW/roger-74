/**
 * Mathematical Verification System
 * 
 * Provides strict mathematical models for response verification
 * including logarithmic predictions and rollback mechanisms
 */

import { detectPatterns } from '../patternDetection/detector';
import { responseTimingFunctions, specializedConcernPatterns } from '../patternDetection/patterns';
import { isSuicidalIdeation, isDirectMedicalAdvice } from '../../../masterRules';

// Strict verification threshold constants - Adjusted to make rollbacks 25% easier
const REPETITION_THRESHOLD = 0.6; // Was 0.8 (25% reduction)
const MEMORY_REFERENCE_THRESHOLD = 0.45; // Was 0.6 (25% reduction)
const HALLUCINATION_THRESHOLD = 0.525; // Was 0.7 (25% reduction)
const CRITICAL_TOPIC_MULTIPLIER = 2.5; // Was 2.0 (25% increase in strength)
const ROLLBACK_EASE_FACTOR = 0.75; // 25% easier rollback threshold

// Response verification result type
export interface VerificationResult {
  isVerified: boolean;
  confidenceScore: number;
  responseTiming: number; // milliseconds to delay
  shouldRollback: boolean;
  detectedIssues: string[];
  suggestedAction: 'proceed' | 'delay' | 'rollback' | 'prevent';
}

/**
 * Mathematically verify response quality using strict logarithmic models
 * Now with 25% easier rollback initiation and strengthened prevention
 */
export function verifyResponseMathematically(
  responseText: string,
  userInput: string,
  conversationHistory: string[] = [],
  previousResponses: string[] = []
): VerificationResult {
  // Initialize verification result
  const result: VerificationResult = {
    isVerified: true,
    confidenceScore: 1.0,
    responseTiming: 0,
    shouldRollback: false,
    detectedIssues: [],
    suggestedAction: 'proceed'
  };
  
  // 1. Check for repetitive patterns using enhanced detection
  const patternResult = detectPatterns(responseText, previousResponses);
  
  if (patternResult.isRepetitive) {
    // Strengthen penalty by 25%
    result.confidenceScore *= (1 - Math.log10(patternResult.repetitionScore * 1.25 + 1) / 10);
    result.detectedIssues.push(`Repetitive patterns detected (score: ${patternResult.repetitionScore.toFixed(2)})`);
    
    // Calculate logarithmic response timing delay based on repetition score
    const repetitionCount = previousResponses.filter(r => 
      calculateSimilarity(r, responseText) > 0.6
    ).length;
    
    // Increase delay for repetitions by 25%
    result.responseTiming = responseTimingFunctions.logarithmicDelay(repetitionCount) * 1.25;
  }
  
  // 2. Check for false memory references
  if (conversationHistory.length < 3 && hasMemoryReference(responseText)) {
    // Increase memory reference penalty by 25%
    const penaltyFactor = Math.log10(10) * 1.25; // logarithmic penalty of 1.25
    result.confidenceScore *= (1 - penaltyFactor / 10);
    result.detectedIssues.push('False memory reference in early conversation');
  }
  
  // 3. Check for hallucination indicators
  const hallucinationScore = detectHallucinationIndicators(responseText, userInput, conversationHistory);
  if (hallucinationScore > 0) {
    // Increase hallucination penalty by 25%
    const penaltyFactor = Math.log10(hallucinationScore * 12.5 + 1); // Was 10, now 12.5
    result.confidenceScore *= (1 - penaltyFactor / 10);
    result.detectedIssues.push(`Potential hallucination indicators (score: ${hallucinationScore.toFixed(2)})`);
  }
  
  // 4. Check for specialized concerns requiring extra scrutiny
  const concernMultiplier = detectSpecializedConcerns(userInput, responseText);
  if (concernMultiplier > 1) {
    // Apply stricter standards for specialized concerns
    result.confidenceScore /= concernMultiplier;
    result.detectedIssues.push(`Specialized concern requiring additional verification (multiplier: ${concernMultiplier.toFixed(2)})`);
  }
  
  // 5. Check for crisis situations requiring immediate intervention
  if (isSuicidalIdeation(userInput) || isDirectMedicalAdvice(userInput)) {
    // Increase penalty for crisis situations by 25%
    result.confidenceScore *= 0.375; // Was 0.5, now 0.375 (25% stronger)
    result.detectedIssues.push('Crisis or medical advice situation detected');
  }
  
  // Determine final verification status - make rollbacks 25% easier to trigger
  // Apply the rollback ease factor
  result.shouldRollback = responseTimingFunctions.shouldRollback(patternResult.repetitionScore * ROLLBACK_EASE_FACTOR);
  
  // Keep verification threshold the same but make rollbacks easier
  result.isVerified = result.confidenceScore > 0.7 && !result.shouldRollback;
  
  // Determine recommended action based on verification
  if (!result.isVerified) {
    if (result.shouldRollback) {
      result.suggestedAction = 'rollback';
    } else if (result.confidenceScore < 0.5) {
      result.suggestedAction = 'prevent';
    } else {
      result.suggestedAction = 'delay';
    }
  }
  
  return result;
}

/**
 * Check if response contains memory references
 */
function hasMemoryReference(text: string): boolean {
  return /you (mentioned|said|told me|indicated)|earlier you|previously you|we (discussed|talked about)|I remember|as you (mentioned|said|noted)|we've been/i.test(text);
}

/**
 * Calculate similarity between two strings
 */
function calculateSimilarity(str1: string, str2: string): number {
  // Simple Jaccard similarity implementation
  const set1 = new Set(str1.toLowerCase().split(/\s+/));
  const set2 = new Set(str2.toLowerCase().split(/\s+/));
  
  const intersection = [...set1].filter(word => set2.has(word)).length;
  const union = set1.size + set2.size - intersection;
  
  return intersection / union;
}

/**
 * Detect indicators of hallucination in the response
 * Returns a score between 0 and 1
 */
function detectHallucinationIndicators(
  responseText: string,
  userInput: string,
  conversationHistory: string[]
): number {
  let score = 0;
  
  // Check for references to topics not mentioned
  const userTopics = extractTopics(userInput);
  const historyTopics = conversationHistory.flatMap(msg => extractTopics(msg));
  const responseTopics = extractTopics(responseText);
  
  const allKnownTopics = [...new Set([...userTopics, ...historyTopics])];
  
  // Calculate topic hallucination score
  responseTopics.forEach(topic => {
    if (!allKnownTopics.some(knownTopic => topic.includes(knownTopic) || knownTopic.includes(topic))) {
      score += 0.2; // Penalty for each potentially hallucinated topic
    }
  });
  
  // Check for false continuity claims
  if (/as we discussed|as you mentioned|we've been focusing on/i.test(responseText)) {
    if (conversationHistory.length < 3) {
      score += 0.5; // High penalty for false continuity in new conversations
    }
  }
  
  // Check for referencing specific patient statements without evidence
  const quotesMatch = responseText.match(/"([^"]+)"|'([^']+)'/g);
  if (quotesMatch) {
    quotesMatch.forEach(quote => {
      const quoteText = quote.replace(/['"]/g, '').toLowerCase();
      const quoteInHistory = conversationHistory.some(msg => 
        msg.toLowerCase().includes(quoteText)
      );
      
      if (!quoteInHistory) {
        score += 0.3; // Penalty for each potentially false quote
      }
    });
  }
  
  return Math.min(1.0, score); // Cap at 1.0
}

/**
 * Extract potential topics from text
 */
function extractTopics(text: string): string[] {
  // Simple noun phrase extraction (could be enhanced with NLP)
  const nounPhrases = text.match(/\b[A-Za-z]+(ing|ed|ment|ion|ity|ness)\b|\b[A-Za-z]+ [A-Za-z]+\b/g) || [];
  return nounPhrases.map(phrase => phrase.toLowerCase());
}

/**
 * Detect specialized concerns requiring additional verification
 * Returns a multiplier to increase scrutiny
 */
function detectSpecializedConcerns(userInput: string, responseText: string): number {
  let multiplier = 1.0;
  
  // Check for eating disorder concerns
  if (specializedConcernPatterns.eatingDisorders.some(pattern => pattern.test(userInput))) {
    multiplier *= 1.5;
  }
  
  // Check for gambling concerns
  if (specializedConcernPatterns.gambling.some(pattern => pattern.test(userInput))) {
    multiplier *= 1.5;
  }
  
  // Check for substance abuse concerns
  if (specializedConcernPatterns.substanceAbuse.some(pattern => pattern.test(userInput))) {
    multiplier *= 1.5;
  }
  
  // Check for crisis/emergency concerns
  if (specializedConcernPatterns.crisis.some(pattern => pattern.test(userInput))) {
    multiplier *= CRITICAL_TOPIC_MULTIPLIER;
  }
  
  return multiplier;
}

/**
 * Calculate logarithmic delay based on response confidence
 * Increased by 25% for more thorough processing
 */
export function calculateResponseDelay(confidenceScore: number): number {
  // Lower confidence = longer delay (logarithmic) - increased by 25%
  const baseDelay = 625; // Was 500 milliseconds
  const maxDelay = 3750; // Was 3000 milliseconds
  
  if (confidenceScore >= 0.9) {
    return baseDelay;
  }
  
  // Use logarithmic scale with 25% stronger effect: delay increases as confidence decreases
  return Math.min(maxDelay, baseDelay + Math.log10(1 + (1 - confidenceScore) * 12.5) * 1875); // Was 10 and 1500
}

/**
 * Determine if response should be completely prevented
 * Prevention threshold remains unchanged - we prefer rollback over full prevention
 */
export function shouldPreventResponse(verificationResult: VerificationResult): boolean {
  return verificationResult.suggestedAction === 'prevent';
}

/**
 * Generate a safe fallback response when verification fails
 * Now with more thoughtful and specific fallbacks
 */
export function generateFallbackResponse(userInput: string): string {
  // More thoughtful fallback options based on input
  const fallbacks = [
    "I want to make sure I respond accurately. Could you tell me more about what you're experiencing?",
    "I appreciate you sharing that with me. To better understand your situation, could you provide some additional context?",
    "Thank you for your patience. I want to be helpful - could you share a bit more about what's on your mind?",
    "I'm listening and want to provide the most thoughtful response. Could you elaborate on what you're going through?",
    "I'd like to make sure I understand correctly before responding. Could you tell me more about your situation?",
    "To provide the most meaningful support, I'd appreciate if you could share more about what you're experiencing right now."
  ];
  
  // Select a fallback based on mathematical hash of input for consistent selection
  const inputHash = hashString(userInput);
  return fallbacks[inputHash % fallbacks.length];
}

/**
 * Simple string hashing function
 */
function hashString(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash);
}
