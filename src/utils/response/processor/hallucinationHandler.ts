
/**
 * Hallucination Handler
 * 
 * Integrates the hallucination prevention system into Roger's 
 * response processing pipeline.
 */

import { preventHallucinations, HallucinationProcessResult } from '../../hallucinationPrevention';
import { getConversationMessageCount } from '../../memory/newConversationDetector';

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
    const containsMemoryReference = /I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about|we discussed/i.test(responseText);
    
    // Get conversation message count
    const messageCount = getConversationMessageCount();
    const isNewConversation = messageCount < 3;
    
    // For new conversations with memory references, always apply strict prevention
    if (isNewConversation && containsMemoryReference) {
      console.log("CRITICAL: Memory references in new conversation detected, applying strict prevention");
      
      // Apply enhanced detection with high sensitivity
      const hallucinationResult = preventHallucinations(responseText, userInput, conversationHistory, {
        detectionSensitivity: 0.9,
        enableReasoning: true,
        enableRAG: false // Don't enhance with RAG in this case
      });
      
      return {
        processedResponse: hallucinationResult.processedResponse,
        hallucinationData: hallucinationResult
      };
    }
    
    // For regular conversations, apply standard prevention
    // but only if response contains memory references
    if (containsMemoryReference) {
      const hallucinationResult = preventHallucinations(responseText, userInput, conversationHistory);
      
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
      detectionSensitivity: 0.4
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
 * Basic NLP extraction for primary concerns
 */
const extractTopicsFromInput = (userInput: string): string[] => {
  const topics: string[] = [];
  
  // Look for key phrases that indicate topics
  const keyPhrases = [
    { pattern: /(?:worried|anxious|anxiety) about ([\w\s]+)/i, type: 'anxiety' },
    { pattern: /(?:sad|depressed|down) about ([\w\s]+)/i, type: 'mood' },
    { pattern: /(?:problem|issue|trouble) with ([\w\s]+)/i, type: 'problem' },
    { pattern: /my ([\w]+) (?:is|has|have|seems)/i, type: 'subject' }
  ];
  
  // Extract matches
  for (const { pattern, type } of keyPhrases) {
    const match = userInput.match(pattern);
    if (match && match[1]) {
      topics.push(match[1].trim());
    }
  }
  
  // If no matches, try to extract nouns as topics
  if (topics.length === 0) {
    // Simple noun extraction - could be enhanced with proper NLP
    const words = userInput.split(/\s+/);
    
    for (const word of words) {
      // Basic heuristic: capitalize words may be nouns
      if (word.length > 3 && 
          word[0] === word[0].toUpperCase() && 
          !['I', 'My', 'The', 'A', 'An', 'This', 'That'].includes(word)) {
        topics.push(word);
      }
    }
  }
  
  return topics;
};
