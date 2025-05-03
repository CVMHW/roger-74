
/**
 * Chat Log Review Module - TERTIARY SAFEGUARD
 * 
 * This module provides comprehensive conversation history review 
 * to ensure response continuity and memory utilization.
 * 
 * It acts as a tertiary safeguard after primary memory and 5ResponseMemory.
 */

import { getFiveResponseMemory } from '../memory/fiveResponseMemory';
import { retrieveRelevantMemories } from '../memory/memoryBank';

/**
 * Process a response through complete chat log review
 */
export const processThroughChatLogReview = (
  proposedResponse: string, 
  userInput: string,
  conversationHistory: string[]
): string => {
  try {
    console.log("TERTIARY SAFEGUARD: Running complete chat log review");
    
    // Skip processing if conversation history is minimal
    if (!conversationHistory || conversationHistory.length < 2) {
      return proposedResponse;
    }
    
    // STEP 1: Identify key topics in current conversation
    const conversationTopics = identifyConversationTopics(conversationHistory);
    
    // STEP 2: Check if response addresses current topics
    const addressesCurrentTopics = checkTopicCoverage(proposedResponse, conversationTopics);
    
    // STEP 3: Check for unaddressed concerns from history
    const unaddressedConcerns = identifyUnaddressedConcerns(
      conversationHistory, 
      proposedResponse
    );
    
    // STEP 4: Check for potential misunderstandings
    const potentialMisunderstandings = identifyPotentialMisunderstandings(
      userInput,
      proposedResponse,
      conversationHistory
    );
    
    // STEP 5: Enhance response if needed based on chat log review
    if (!addressesCurrentTopics || unaddressedConcerns.length > 0 || potentialMisunderstandings.length > 0) {
      return enhanceResponseBasedOnChatLogReview(
        proposedResponse,
        conversationTopics,
        unaddressedConcerns,
        potentialMisunderstandings
      );
    }
    
    return proposedResponse;
  } catch (error) {
    console.error("Error in chat log review:", error);
    return proposedResponse;
  }
};

/**
 * Identify key topics in the conversation history
 */
const identifyConversationTopics = (conversationHistory: string[]): string[] => {
  try {
    const topics: string[] = [];
    
    // Define topic patterns to look for
    const topicPatterns = [
      { regex: /\b(work|job|career|boss|colleague|office|workplace)\b/i, topic: 'work' },
      { regex: /\b(family|parent|child|mom|dad|brother|sister|spouse|marriage)\b/i, topic: 'family' },
      { regex: /\b(friend|relationship|partner|social|dating|love)\b/i, topic: 'relationships' },
      { regex: /\b(health|sick|pain|doctor|hospital|illness|symptom|medicine)\b/i, topic: 'health' },
      { regex: /\b(money|finance|bill|debt|afford|budget|cost|spend|income)\b/i, topic: 'finances' },
      { regex: /\b(stress|anxiety|worry|concern|nervous|overwhelm|pressure)\b/i, topic: 'stress' },
      { regex: /\b(sad|depress|unhappy|down|blue|grief|loss|low)\b/i, topic: 'sadness' },
      { regex: /\b(future|goal|plan|direction|purpose|meaning|hope)\b/i, topic: 'future' },
      { regex: /\b(sleep|tired|exhausted|insomnia|rest|fatigue|energy)\b/i, topic: 'sleep' },
      { regex: /\b(anger|angry|mad|furious|rage|irritate|frustrate)\b/i, topic: 'anger' }
    ];
    
    // Focus on the most recent messages (last 5)
    const recentMessages = conversationHistory.slice(-5);
    const combinedText = recentMessages.join(' ').toLowerCase();
    
    // Identify topics using regex patterns
    for (const { regex, topic } of topicPatterns) {
      if (regex.test(combinedText) && !topics.includes(topic)) {
        topics.push(topic);
      }
    }
    
    // Also check 5ResponseMemory for redundancy
    try {
      const fiveResponseMemory = getFiveResponseMemory();
      const patientMessages = fiveResponseMemory
        .filter(entry => entry.role === 'patient')
        .map(entry => entry.content)
        .join(' ').toLowerCase();
      
      for (const { regex, topic } of topicPatterns) {
        if (regex.test(patientMessages) && !topics.includes(topic)) {
          topics.push(topic);
        }
      }
    } catch (memError) {
      console.error('Error accessing 5ResponseMemory during topic identification:', memError);
    }
    
    return topics;
  } catch (error) {
    console.error("Error identifying conversation topics:", error);
    return [];
  }
};

/**
 * Check if response addresses the current topics
 */
const checkTopicCoverage = (response: string, topics: string[]): boolean => {
  if (topics.length === 0) {
    return true; // No specific topics to cover
  }
  
  // Count how many topics are addressed in the response
  const responseLower = response.toLowerCase();
  let topicsCovered = 0;
  
  for (const topic of topics) {
    // Check for direct mentions or related words
    switch (topic) {
      case 'work':
        if (/\b(work|job|career|workplace|profession)\b/i.test(responseLower)) {
          topicsCovered++;
        }
        break;
      case 'family':
        if (/\b(family|parent|child|mom|dad|brother|sister|spouse|marriage|relative)\b/i.test(responseLower)) {
          topicsCovered++;
        }
        break;
      case 'relationships':
        if (/\b(relationship|friend|partner|connection|social|dating|love)\b/i.test(responseLower)) {
          topicsCovered++;
        }
        break;
      case 'health':
        if (/\b(health|wellness|wellbeing|medical|physical|mental|body|healing)\b/i.test(responseLower)) {
          topicsCovered++;
        }
        break;
      case 'finances':
        if (/\b(money|finance|financial|budget|cost|expense|income|saving|afford)\b/i.test(responseLower)) {
          topicsCovered++;
        }
        break;
      case 'stress':
        if (/\b(stress|pressure|overwhelm|tension|anxious|anxiety|cope|strain)\b/i.test(responseLower)) {
          topicsCovered++;
        }
        break;
      case 'sadness':
        if (/\b(sad|sadness|unhappy|down|blue|grief|loss|low|depress|upset)\b/i.test(responseLower)) {
          topicsCovered++;
        }
        break;
      default:
        // For other topics, just check for the topic word itself
        if (responseLower.includes(topic)) {
          topicsCovered++;
        }
        break;
    }
  }
  
  // Consider it covered if we address at least one topic
  // or if the response contains general acknowledgment
  return topicsCovered > 0 || 
    /\b(mentioned|talked about|shared|discussed|told me about)\b/i.test(responseLower);
};

/**
 * Identify potential concerns from history that aren't addressed
 */
const identifyUnaddressedConcerns = (
  conversationHistory: string[],
  proposedResponse: string
): string[] => {
  try {
    const concerns: string[] = [];
    
    // Define patterns for common concerns
    const concernPatterns = [
      { regex: /\b(can'?t sleep|insomnia|trouble sleeping|wake up)\b/i, concern: 'sleep problems' },
      { regex: /\bworry|anxious|scared|afraid|terrified\b/i, concern: 'anxiety' },
      { regex: /\b(feeling down|depress|sad|hopeless|suicid|hurt myself|end my life)\b/i, concern: 'depression' },
      { regex: /\b(alone|lonely|no friends|no one|isolated|abandoned)\b/i, concern: 'loneliness' },
      { regex: /\b(fight|argument|conflict|divorce|breaking up|separated)\b/i, concern: 'relationship conflict' },
      { regex: /\b(can'?t afford|money problems|debt|bills|financial|broke)\b/i, concern: 'financial difficulties' },
      { regex: /\b(pain|hurt|ache|sore|chronic|suffering|agony)\b/i, concern: 'physical discomfort' }
    ];
    
    // Look for concerns in recent messages
    const recentMessages = conversationHistory.slice(-5);
    
    for (const message of recentMessages) {
      for (const { regex, concern } of concernPatterns) {
        if (regex.test(message) && !concerns.includes(concern)) {
          // Check if concern is NOT mentioned in response
          if (!proposedResponse.toLowerCase().includes(concern.toLowerCase())) {
            concerns.push(concern);
          }
        }
      }
    }
    
    return concerns;
  } catch (error) {
    console.error("Error identifying unaddressed concerns:", error);
    return [];
  }
};

/**
 * Identify potential misunderstandings in the response
 */
const identifyPotentialMisunderstandings = (
  userInput: string,
  proposedResponse: string,
  conversationHistory: string[]
): string[] => {
  try {
    const misunderstandings: string[] = [];
    
    // Check for questions in user input that aren't addressed
    const userQuestions = userInput.match(/\b(what|how|why|when|where|who|which|can|could|would|should|is|are|will|did)\b.*\?/gi);
    
    if (userQuestions && userQuestions.length > 0 && 
        !proposedResponse.includes("?") && 
        !/I'm not sure|let me think|that's a good question/i.test(proposedResponse)) {
      misunderstandings.push('unaddressed question');
    }
    
    // Check for topic switches without acknowledgment
    if (conversationHistory.length >= 2) {
      const previousMessage = conversationHistory[conversationHistory.length - 2];
      const topicShift = detectTopicShift(previousMessage, userInput);
      
      if (topicShift && !(/as you mentioned|shifting to|regarding your|about your/i.test(proposedResponse))) {
        misunderstandings.push('unacknowledged topic shift');
      }
    }
    
    // Check if response tone matches emotional content of message
    const emotionalMismatch = detectEmotionalMismatch(userInput, proposedResponse);
    if (emotionalMismatch) {
      misunderstandings.push('tone mismatch');
    }
    
    return misunderstandings;
  } catch (error) {
    console.error("Error identifying potential misunderstandings:", error);
    return [];
  }
};

/**
 * Detect if there was a significant topic shift between messages
 */
const detectTopicShift = (previousMessage: string, currentMessage: string): boolean => {
  // Define major topic categories
  const topicCategories = [
    { name: 'work', patterns: /\b(work|job|career|boss|colleague|office|workplace)\b/i },
    { name: 'family', patterns: /\b(family|parent|child|mom|dad|brother|sister|spouse|marriage)\b/i },
    { name: 'health', patterns: /\b(health|sick|pain|doctor|hospital|illness|symptom|medicine)\b/i },
    { name: 'emotions', patterns: /\b(feel|feeling|sad|happy|angry|anxious|worried|scared|stressed)\b/i },
    { name: 'relationships', patterns: /\b(friend|relationship|partner|dating|love|boyfriend|girlfriend)\b/i }
  ];
  
  // Identify topics in each message
  const previousTopics = topicCategories
    .filter(topic => topic.patterns.test(previousMessage))
    .map(topic => topic.name);
    
  const currentTopics = topicCategories
    .filter(topic => topic.patterns.test(currentMessage))
    .map(topic => topic.name);
  
  // Check if there's no overlap between topics
  return (
    previousTopics.length > 0 && 
    currentTopics.length > 0 && 
    !previousTopics.some(topic => currentTopics.includes(topic))
  );
};

/**
 * Detect if there's an emotional mismatch between message and response
 */
const detectEmotionalMismatch = (message: string, response: string): boolean => {
  // Check for serious emotional content
  const seriousEmotionalContent = 
    /\b(crying|tears|sobbing|devastated|heartbroken|miserable|despair|grief|trauma|suicide|kill myself|die)\b/i.test(message);
  
  // Check for inappropriately light response
  const lightResponse = 
    /\b(great|wonderful|excellent|fantastic|exciting|happy to hear|glad|exciting)\b/i.test(response);
  
  // Check for angry message with overly positive response
  const angryMessage = 
    /\b(angry|furious|mad|outraged|pissed|hate|despise|resent)\b/i.test(message);
  
  return (seriousEmotionalContent && lightResponse) || (angryMessage && lightResponse);
};

/**
 * Enhance response based on chat log review findings
 */
const enhanceResponseBasedOnChatLogReview = (
  proposedResponse: string,
  conversationTopics: string[],
  unaddressedConcerns: string[],
  potentialMisunderstandings: string[]
): string => {
  try {
    let enhancedResponse = proposedResponse;
    
    // Check if memory is already referenced in the response
    const containsMemoryReference = /remember|mentioned|earlier|previously|you've shared|you told me|we talked about|you said|as we discussed|based on what you/i.test(proposedResponse);
    
    // If we need to enhance the response
    if (
      (conversationTopics.length > 0 || unaddressedConcerns.length > 0) && 
      !containsMemoryReference
    ) {
      // Try to get memories from MemoryBank first
      try {
        const relevantMemories = retrieveRelevantMemories(conversationTopics.join(' '), conversationTopics);
        
        if (relevantMemories.length > 0) {
          const memory = relevantMemories[0];
          
          // Add memory reference at beginning of response
          enhancedResponse = `I remember you mentioned ${memory.content.substring(0, 30)}... ${enhancedResponse}`;
          return enhancedResponse;
        }
      } catch (memoryError) {
        console.error('Failed to access MemoryBank during response enhancement:', memoryError);
      }
      
      // Fallback to topic-based reference
      if (conversationTopics.length > 0) {
        const mainTopic = conversationTopics[0];
        enhancedResponse = `I remember we were discussing ${mainTopic}. ${enhancedResponse}`;
      }
    }
    
    // Add acknowledgment if there are unaddressed concerns
    if (unaddressedConcerns.length > 0 && !containsMemoryReference) {
      const mainConcern = unaddressedConcerns[0];
      
      if (!enhancedResponse.includes(mainConcern)) {
        enhancedResponse = `I also remember your concern about ${mainConcern}. ${enhancedResponse}`;
      }
    }
    
    // Fix potential misunderstandings
    if (
      potentialMisunderstandings.includes('unaddressed question') && 
      !enhancedResponse.includes('?')
    ) {
      enhancedResponse += " Was there a specific question you wanted me to answer?";
    }
    
    if (potentialMisunderstandings.includes('tone mismatch')) {
      // Add a more appropriate emotional acknowledgment
      if (!/understand|difficult|challenging|hard|tough|painful/i.test(enhancedResponse)) {
        enhancedResponse = `I understand this must be difficult. ${enhancedResponse}`;
      }
    }
    
    return enhancedResponse;
  } catch (error) {
    console.error("Error enhancing response based on chat log review:", error);
    return proposedResponse;
  }
};

export default {
  processThroughChatLogReview
};
