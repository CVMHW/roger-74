
/**
 * Chat Log Reviewer - TERTIARY SAFEGUARD
 * 
 * This module provides a comprehensive review of the entire chat log
 * before each response to ensure continuity, understanding, and adherence
 * to patient needs and concerns.
 * 
 * ENHANCED: Now integrated with advanced MemoryBank architecture
 */

import { recordToMemory, getAllMemory } from '../nlpProcessor';
import { addToFiveResponseMemory } from '../memory/fiveResponseMemory';
import { addToMemoryBank, retrieveRelevantMemories } from '../memory/memoryBank';
import { processWithMultiHeadAttention } from '../memory/multiHeadAttention';

/**
 * Process a response through comprehensive chat log review
 * This is the TERTIARY SAFEGUARD to ensure patient needs are addressed
 * 
 * @param proposedResponse The response to be reviewed
 * @param currentUserInput The current user input
 * @param conversationHistory The full conversation history
 * @returns Enhanced response that addresses continuity issues
 */
export const processThroughChatLogReview = (
  proposedResponse: string,
  currentUserInput: string,
  conversationHistory: string[] = []
): string => {
  console.log("TERTIARY SAFEGUARD: Reviewing entire chat log before responding");
  
  try {
    // If conversation is too short, no need for extensive review
    if (conversationHistory.length < 3) {
      return proposedResponse;
    }
    
    // Step 1: Process with multi-head attention for comprehensive context
    const attentionResults = processWithMultiHeadAttention(
      currentUserInput,
      conversationHistory
    );
    
    // Step 2: Identify key topics from attention results
    const keyTopics = attentionResults.dominantTopics;
    console.log("TERTIARY SAFEGUARD: Identified key topics:", keyTopics);
    
    // Step 3: Detect any unaddressed concerns from previous messages
    const unaddressedConcerns = detectUnaddressedConcerns(conversationHistory);
    console.log("TERTIARY SAFEGUARD: Unaddressed concerns:", unaddressedConcerns);
    
    // Step 4: Check for potential misunderstandings
    const potentialMisunderstandings = identifyPotentialMisunderstandings(
      conversationHistory,
      currentUserInput,
      proposedResponse
    );
    console.log("TERTIARY SAFEGUARD: Potential misunderstandings:", potentialMisunderstandings);
    
    // Step 5: Retrieve relevant memories from MemoryBank
    const relevantMemories = retrieveRelevantMemories(
      currentUserInput,
      keyTopics,
      attentionResults.emotionalContext
    );
    console.log("TERTIARY SAFEGUARD: Retrieved relevant memories:", 
      relevantMemories.length > 0 ? "Yes" : "None");
    
    // Step 6: Enhance response based on findings
    let enhancedResponse = proposedResponse;
    
    // Add acknowledgment of unaddressed concerns if needed
    if (unaddressedConcerns.length > 0) {
      const concern = unaddressedConcerns[0]; // Address the most important one
      
      // Only add if the concern isn't already mentioned in the response
      if (!enhancedResponse.toLowerCase().includes(concern.toLowerCase())) {
        const acknowledgment = `I also wanted to circle back to what you mentioned earlier about ${concern}. `;
        enhancedResponse = acknowledgment + enhancedResponse;
      }
    }
    
    // Correct misunderstandings if detected
    if (potentialMisunderstandings.length > 0) {
      const misunderstanding = potentialMisunderstandings[0];
      
      // Check if the misunderstanding isn't already addressed
      if (!enhancedResponse.toLowerCase().includes("clarify") && 
          !enhancedResponse.toLowerCase().includes("understand better")) {
        const correction = `Just to make sure I understand correctly - ${misunderstanding}. `;
        enhancedResponse = correction + enhancedResponse;
      }
    }
    
    // Ensure continuity by referencing key topics if they're missing
    const hasKeyTopicReference = keyTopics.some(topic => 
      enhancedResponse.toLowerCase().includes(topic.toLowerCase())
    );
    
    if (!hasKeyTopicReference && keyTopics.length > 0) {
      const continuityPhrase = `Regarding our conversation about ${keyTopics[0]}, `;
      enhancedResponse = continuityPhrase + enhancedResponse;
    }
    
    // Ensure memory reference if none exists yet
    if (!enhancedResponse.toLowerCase().includes("remember") && 
        !enhancedResponse.toLowerCase().includes("mentioned") &&
        !enhancedResponse.toLowerCase().includes("earlier") &&
        relevantMemories.length > 0) {
      
      const memoryRef = relevantMemories[0];
      const memoryPhrase = `I remember you mentioned "${memoryRef.content.substring(0, 20)}..." `;
      enhancedResponse = memoryPhrase + enhancedResponse;
    }
    
    // Record the enhancement to all memory systems
    if (enhancedResponse !== proposedResponse) {
      console.log("TERTIARY SAFEGUARD: Enhanced response based on chat log review");
      recordToMemory(currentUserInput, enhancedResponse);
      addToFiveResponseMemory('roger', enhancedResponse);
      addToMemoryBank(
        enhancedResponse, 
        'roger', 
        attentionResults.emotionalContext, 
        attentionResults.dominantTopics,
        0.8 // High importance for enhanced responses
      );
    }
    
    return enhancedResponse;
    
  } catch (error) {
    console.error("Error in chat log review:", error);
    // In case of error, return the original response
    return proposedResponse;
  }
};

/**
 * Identify the key topics discussed throughout the conversation
 */
const identifyKeyTopics = (conversationHistory: string[]): string[] => {
  // Focus on user messages (even indices in conversation history)
  const userMessages = conversationHistory.filter((_, index) => index % 2 === 0);
  
  // Simplified topic detection using frequency analysis
  const topicFrequency: Record<string, number> = {};
  
  // Common topics to look for
  const topicPatterns = [
    { regex: /\b(work|job|career|boss|colleague|office)\b/i, topic: 'work' },
    { regex: /\b(family|parent|child|mom|dad|brother|sister|spouse)\b/i, topic: 'family' },
    { regex: /\b(friend|relationship|partner|social)\b/i, topic: 'relationships' },
    { regex: /\b(health|sick|pain|doctor|hospital|illness)\b/i, topic: 'health' },
    { regex: /\b(money|finance|bill|debt|afford|budget)\b/i, topic: 'finances' },
    { regex: /\b(stress|anxiety|worry|concern|nervous)\b/i, topic: 'stress' },
    { regex: /\b(sad|depression|unhappy|down|blue)\b/i, topic: 'depression' },
    { regex: /\b(future|goal|plan|direction|purpose)\b/i, topic: 'future plans' },
    { regex: /\b(sleep|tired|exhausted|insomnia|rest)\b/i, topic: 'sleep' },
    { regex: /\b(anger|angry|mad|furious|rage)\b/i, topic: 'anger' },
    // Add more patterns as needed
  ];
  
  // Count occurrences of topics
  userMessages.forEach(message => {
    topicPatterns.forEach(({ regex, topic }) => {
      if (regex.test(message)) {
        topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
      }
    });
  });
  
  // Sort topics by frequency
  return Object.entries(topicFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([topic]) => topic);
};

/**
 * Detect concerns that have been raised but not adequately addressed
 */
const detectUnaddressedConcerns = (conversationHistory: string[]): string[] => {
  const unaddressedConcerns: string[] = [];
  
  // Look for explicit questions or concerns
  for (let i = 0; i < conversationHistory.length - 2; i += 2) {
    // Only examine user messages
    const userMessage = conversationHistory[i];
    const rogerResponse = conversationHistory[i + 1] || "";
    
    // Check for question patterns
    const questionMatches = userMessage.match(/\b(what about|how do I|can you help|why is|when will|is there|can I|should I|would you|could you)[\w\s]+\?/gi);
    if (questionMatches) {
      // For each question, check if it was addressed in Roger's response
      questionMatches.forEach(question => {
        const questionKeywords = extractKeywords(question);
        const isAddressed = questionKeywords.some(keyword => 
          rogerResponse.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (!isAddressed) {
          unaddressedConcerns.push(question);
        }
      });
    }
    
    // Check for concern statements
    const concernMatches = userMessage.match(/\b(I'm concerned about|I'm worried about|I need help with|I'm struggling with|I don't know how to|I can't seem to)[\w\s]+/gi);
    if (concernMatches) {
      // For each concern, check if it was addressed
      concernMatches.forEach(concern => {
        const concernKeywords = extractKeywords(concern);
        const isAddressed = concernKeywords.some(keyword => 
          rogerResponse.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (!isAddressed) {
          unaddressedConcerns.push(concern);
        }
      });
    }
  }
  
  return unaddressedConcerns;
};

/**
 * Extract meaningful keywords from a text string
 */
const extractKeywords = (text: string): string[] => {
  // Remove common words and extract keywords
  return text.toLowerCase()
    .replace(/[.,?!;:'"]/g, '')
    .split(/\s+/)
    .filter(word => 
      word.length > 3 && 
      !['what', 'when', 'where', 'which', 'this', 'that', 'these', 'those', 
        'about', 'would', 'could', 'should', 'their', 'there', 'have', 'with'].includes(word)
    );
};

/**
 * Identify potential misunderstandings based on the conversation flow
 */
const identifyPotentialMisunderstandings = (
  conversationHistory: string[],
  currentInput: string,
  proposedResponse: string
): string[] => {
  const misunderstandings: string[] = [];
  
  // Check if current message indicates a correction
  const correctionPatterns = [
    /\b(no|not|that's not|that is not|I didn't|I did not)\b/i,
    /\b(you misunderstood|you didn't understand|you're not getting|you are not getting)\b/i,
    /\b(that's not what I|that is not what I|that's not what I'm|that is not what I'm)\b/i,
    /\b(I meant|I was saying|I'm trying to say|I am trying to say)\b/i
  ];
  
  const hasCorrectionIndicator = correctionPatterns.some(pattern => pattern.test(currentInput));
  
  if (hasCorrectionIndicator) {
    // Extract what might have been misunderstood
    const previousRogerResponse = conversationHistory[conversationHistory.length - 1] || "";
    const topicsInPreviousResponse = identifyKeyTopics([previousRogerResponse]);
    
    if (topicsInPreviousResponse.length > 0) {
      misunderstandings.push(`I want to clarify what you meant about ${topicsInPreviousResponse[0]}`);
    } else {
      misunderstandings.push("I'd like to better understand what you're trying to convey");
    }
  }
  
  return misunderstandings;
};
