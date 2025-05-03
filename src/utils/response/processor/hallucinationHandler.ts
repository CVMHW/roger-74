
/**
 * Hallucination Handler
 * 
 * Integrates the hallucination prevention system into Roger's 
 * response processing pipeline with enhanced detection capabilities.
 */

import { preventHallucinations, HallucinationProcessResult } from '../../hallucinationPrevention';
import { getConversationMessageCount } from '../../memory/newConversationDetector';
import { HallucinationPreventionOptions } from '../../../types/hallucinationPrevention';

/**
 * Apply hallucination prevention to a response
 */
export const handlePotentialHallucinations = (
  responseText: string,
  userInput: string,
  conversationHistory: string[]
): {
  processedResponse: string;
  hallucinationData: HallucinationProcessResult | null;
} => {
  try {
    // Track if we have a potential memory reference
    const containsMemoryReference = /I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about|we discussed|we've been|you shared|as I recall/i.test(responseText);
    
    // Get conversation message count
    const messageCount = getConversationMessageCount();
    const isNewConversation = messageCount < 3;
    
    // For new conversations with memory references, always apply strict prevention
    if (isNewConversation && containsMemoryReference) {
      console.log("CRITICAL: Memory references in new conversation detected, applying strict prevention");
      
      // Apply enhanced detection with high sensitivity and all methods enabled
      const hallucinationResult = preventHallucinations(responseText, userInput, conversationHistory, {
        detectionSensitivity: 0.95,
        enableReasoning: true,
        enableRAG: false, // Don't enhance with RAG in this case
        enableTokenLevelDetection: true,
        enableNLIVerification: true,
        tokenThreshold: 0.8
      });
      
      return {
        processedResponse: hallucinationResult.processedResponse,
        hallucinationData: hallucinationResult
      };
    }
    
    // For responses with potential repetition, apply special prevention focused on repetition
    if (containsRepeatedPhrases(responseText)) {
      console.log("REPETITION DETECTED: Applying specialized repetition correction");
      
      // Use options focused on repetition detection
      const hallucinationResult = preventHallucinations(responseText, userInput, conversationHistory, {
        detectionSensitivity: 0.8,
        enableReasoning: false,
        enableRAG: false,
        enableTokenLevelDetection: false,
        enableReranking: true
      });
      
      return {
        processedResponse: hallucinationResult.processedResponse,
        hallucinationData: hallucinationResult
      };
    }
    
    // For regular conversations, apply standard prevention
    // but only if response contains memory references
    if (containsMemoryReference) {
      const options: HallucinationPreventionOptions = {
        enableReasoning: true,
        enableRAG: true,
        enableDetection: true,
        detectionSensitivity: 0.65,
        reasoningThreshold: 0.7,
        enableTokenLevelDetection: true
      };
      
      const hallucinationResult = preventHallucinations(responseText, userInput, conversationHistory, options);
      
      return {
        processedResponse: hallucinationResult.processedResponse,
        hallucinationData: hallucinationResult
      };
    }
    
    // For responses with no memory references, still do a basic check
    // but with lower sensitivity to avoid unnecessary changes
    const basicCheck = preventHallucinations(responseText, userInput, conversationHistory, {
      enableReasoning: false,
      enableRAG: false,
      enableDetection: true,
      detectionSensitivity: 0.4,
      enableTokenLevelDetection: false
    });
    
    if (basicCheck.wasRevised) {
      return {
        processedResponse: basicCheck.processedResponse,
        hallucinationData: basicCheck
      };
    }
    
    // No hallucination issues detected
    return {
      processedResponse: responseText,
      hallucinationData: null
    };
    
  } catch (error) {
    console.error("Error in handlePotentialHallucinations:", error);
    
    // In case of error, return the original response
    return {
      processedResponse: responseText,
      hallucinationData: null
    };
  }
};

/**
 * Detect if a response contains repeated phrases
 */
const containsRepeatedPhrases = (responseText: string): boolean => {
  // Check for exact phrase repetition
  const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length < 2) return false;
  
  // Check for similar consecutive sentences
  for (let i = 0; i < sentences.length - 1; i++) {
    const currentSentence = sentences[i].trim().toLowerCase();
    const nextSentence = sentences[i + 1].trim().toLowerCase();
    
    // Compare sentences for similarity
    const similarity = calculateSimilarity(currentSentence, nextSentence);
    if (similarity > 0.7) {
      return true;
    }
  }
  
  // Check for common phrases that repeat
  const phrases: Record<string, number> = {};
  const words = responseText.toLowerCase().split(/\s+/);
  
  // Check for 3-gram, 4-gram, 5-gram repetitions
  for (const n of [3, 4, 5]) {
    if (words.length < n) continue;
    
    for (let i = 0; i <= words.length - n; i++) {
      const phrase = words.slice(i, i + n).join(' ');
      phrases[phrase] = (phrases[phrase] || 0) + 1;
      
      if (phrases[phrase] > 1 && phrase.length > 10) {
        return true;
      }
    }
  }
  
  // Check for repeated memory reference phrases
  const memoryPhrases = ["I remember", "you mentioned", "you told me", "you said", "we discussed"];
  let memoryPhraseCount = 0;
  
  for (const phrase of memoryPhrases) {
    const regex = new RegExp(phrase, 'gi');
    const matches = responseText.match(regex) || [];
    memoryPhraseCount += matches.length;
  }
  
  return memoryPhraseCount > 2;
};

/**
 * Calculate similarity between two text strings
 */
const calculateSimilarity = (str1: string, str2: string): number => {
  // Check length first
  if (Math.abs(str1.length - str2.length) > 10) {
    return 0;
  }
  
  // Simple word overlap for basic similarity
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  // Count matching words
  let matches = 0;
  for (const word of words1) {
    if (word.length > 3 && words2.includes(word)) {
      matches++;
    }
  }
  
  return matches / Math.max(words1.length, words2.length);
};

/**
 * Apply enhanced RAG for early conversations
 * Creates better memory references even without existing memories
 */
export const applyEarlyConversationRAG = (
  responseText: string,
  userInput: string
): string => {
  try {
    // Extract key topics from user input
    const topics = extractTopicsFromInput(userInput);
    
    // Don't modify if no topics or response already addresses them
    if (topics.length === 0) return responseText;
    
    // Check if response already mentions the topic
    for (const topic of topics) {
      if (responseText.toLowerCase().includes(topic.toLowerCase())) {
        return responseText;
      }
    }
    
    // For first-time topics, acknowledge them
    const primaryTopic = topics[0];
    
    // Check if response already has an acknowledgment structure
    if (responseText.startsWith("I hear") || responseText.startsWith("I understand") || 
        responseText.startsWith("I notice") || responseText.startsWith("I see")) {
      return responseText;
    }
    
    // Add acknowledgment at beginning if suitable
    const responseLines = responseText.split('. ');
    
    if (responseLines.length > 1) {
      // Insert after first sentence
      return `${responseLines[0]}. I hear you're talking about ${primaryTopic}. ${responseLines.slice(1).join('. ')}`;
    } else {
      // Simple addition at beginning
      return `I hear that you're dealing with ${primaryTopic}. ${responseText}`;
    }
    
  } catch (error) {
    console.error("Error in applyEarlyConversationRAG:", error);
    return responseText;
  }
};

/**
 * Extract key topics from user input
 * Enhanced with additional pattern matching
 */
const extractTopicsFromInput = (userInput: string): string[] => {
  const topics: string[] = [];
  
  // Look for key phrases that indicate topics
  const keyPhrases = [
    { pattern: /(?:worried|anxious|anxiety) about ([\w\s]+)/i, type: 'anxiety' },
    { pattern: /(?:sad|depressed|down) about ([\w\s]+)/i, type: 'mood' },
    { pattern: /(?:problem|issue|trouble) with ([\w\s]+)/i, type: 'problem' },
    { pattern: /(?:upset|concerned|frustrated) (?:with|about) ([\w\s]+)/i, type: 'concern' },
    { pattern: /(?:happy|excited|thrilled) about ([\w\s]+)/i, type: 'positive' },
    { pattern: /my ([\w]+) (?:is|has|have|seems)/i, type: 'subject' }
  ];
  
  // Extract matches
  for (const { pattern, type } of keyPhrases) {
    const match = userInput.match(pattern);
    if (match && match[1]) {
      topics.push(match[1].trim());
    }
  }
  
  // If no matches, try to extract important nouns or phrases
  if (topics.length === 0) {
    // Attempt to identify key objects or subjects in the input
    // This is a simplified approach - ideally would use proper NLP
    const words = userInput.split(/\s+/);
    const importantPhrases = [];
    
    // Group potential noun phrases (simplified version)
    for (let i = 0; i < words.length; i++) {
      // Skip very short words and common words
      if (words[i].length <= 3 || isCommonWord(words[i])) continue;
      
      // Check for noun phrases (e.g., "cute girl", "rough day")
      if (i < words.length - 1 && !isCommonWord(words[i+1])) {
        importantPhrases.push(`${words[i]} ${words[i+1]}`);
      } else {
        importantPhrases.push(words[i]);
      }
    }
    
    // Add the most likely important phrases
    topics.push(...importantPhrases.slice(0, 2));
  }
  
  return topics;
};

/**
 * Helper: Check if word is a common function word to filter out
 */
const isCommonWord = (word: string): boolean => {
  const commonWords = ["the", "a", "an", "in", "on", "at", "for", "to", "with", "by", "and", "or", "but",
    "is", "are", "was", "were", "be", "been", "have", "has", "had", "do", "does", "did", 
    "will", "would", "can", "could", "may", "might", "must", "should", "i", "you", "he", "she", "it",
    "we", "they", "me", "him", "her", "us", "them"];
  
  return commonWords.includes(word.toLowerCase());
};
