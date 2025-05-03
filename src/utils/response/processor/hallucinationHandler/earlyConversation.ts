
/**
 * Early conversation RAG functionality
 * 
 * Provides specialized handling for the first few messages in a conversation
 */

import { isCommonWord } from './utils';

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
export const extractTopicsFromInput = (userInput: string): string[] => {
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
