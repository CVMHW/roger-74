
/**
 * Memory enforcement core functionality
 */

import { getContextualMemory } from '../../nlpProcessor';
import { retrieveRelevantMemories } from '../../memory/memoryBank';
import { enhanceWithTopicMemory, enhanceWithRelevantMemory, enhanceWithRapport } from './enhancer';
import { detectNewConversation, getConversationMessageCount } from '../../memory/newConversationDetector';

/**
 * Check if a memory reference is appropriate for a given topic and context
 */
const isTopicRelevant = (
  userInput: string, 
  topic: string, 
  emotion: string
): boolean => {
  // Skip generic topics that might confuse the user
  const genericTopics = ['health', 'concerns', 'problems', 'issues', 'situation'];
  
  if (genericTopics.includes(topic.toLowerCase())) {
    // Only use generic topics if they're directly mentioned
    return userInput.toLowerCase().includes(topic.toLowerCase());
  }
  
  // Check if user mentioned this topic or related terms
  const userInputLower = userInput.toLowerCase();
  
  // Match topic synonyms
  const topicSynonyms: {[key: string]: string[]} = {
    'work': ['job', 'boss', 'career', 'workplace', 'office', 'colleague'],
    'relationship': ['date', 'girlfriend', 'boyfriend', 'partner', 'marriage', 'spouse', 'wife', 'husband'],
    'family': ['mom', 'dad', 'parent', 'sister', 'brother', 'child', 'daughter', 'son'],
    'school': ['class', 'teacher', 'professor', 'college', 'university', 'homework', 'exam', 'grade'],
    'anxiety': ['worry', 'nervous', 'anxious', 'stress', 'panic'],
    'depression': ['sad', 'down', 'depressed', 'hopeless', 'unhappy'],
    'sleep': ['tired', 'insomnia', 'rest', 'nap', 'bed'],
    'finance': ['money', 'debt', 'bill', 'afford', 'pay', 'financial']
  };
  
  // Check if topic is directly relevant to user input
  if (userInputLower.includes(topic.toLowerCase())) {
    return true;
  }
  
  // Check synonyms for relevance
  const synonyms = topicSynonyms[topic.toLowerCase()] || [];
  for (const synonym of synonyms) {
    if (userInputLower.includes(synonym)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Enforce memory utilization in responses
 * Ensures Roger demonstrates understanding of the patient's concerns
 * and integrates past conversation details into new responses.
 */
export const applyMemoryRules = (
  responseText: string,
  userInput: string,
  conversationHistory: string[]
): string => {
  try {
    console.log("MEMORY ENFORCER: Applying memory rules to response");
    
    // Don't apply memory rules for new conversations or first few messages
    if (detectNewConversation(userInput) || getConversationMessageCount() < 3) {
      return responseText;
    }
    
    // Check if response already contains memory references
    if (responseText.match(/I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about/i)) {
      return responseText;
    }
    
    // If first-time conversation, don't add memory references
    if (conversationHistory.length <= 2) {
      return responseText;
    }
    
    // UNCONDITIONAL RULE: Always use contextual memory
    const memory = getContextualMemory(userInput);
    
    // Only use dominant topics that are actually relevant to current input
    const relevantTopics = memory.dominantTopics.filter(topic => 
      isTopicRelevant(userInput, topic, memory.dominantEmotion)
    );
    
    // If we have relevant topics or dominant emotions, enhance the response
    if (relevantTopics.length > 0 || 
        (memory.dominantEmotion !== 'neutral' && isTopicRelevant(userInput, '', memory.dominantEmotion))) {
      return enhanceWithTopicMemory(
        responseText,
        relevantTopics.length > 0 ? relevantTopics[0] : '',
        memory.dominantEmotion
      );
    }
    
    // UNCONDITIONAL RULE: Check for relevant memories that match current context
    const relevantMemories = retrieveRelevantMemories(userInput);
    
    if (relevantMemories.length > 0) {
      return enhanceWithRelevantMemory(responseText, userInput, relevantMemories);
    }
    
    // For early conversations, sometimes skip memory references entirely
    const messageCount = getConversationMessageCount();
    if (messageCount < 5 && Math.random() < 0.5) {
      return responseText;
    }
    
    // UNCONDITIONAL RULE: Enhance response with memory integration
    return enhanceWithRapport(responseText, userInput, conversationHistory);
    
  } catch (error) {
    console.error('Error applying memory rules:', error);
    return responseText;
  }
};
