
/**
 * Response Integration
 * 
 * Advanced utilities for enhancing response quality and consistency
 */

import { identifyImmediateConcern } from '../conversation/theSmallStuff/immediateConcrernHandler';
import { detectSimpleNegativeState } from '../conversationalUtils';
import { extractConversationContext } from '../conversationEnhancement/repetitionDetector';

/**
 * Apply unconditional rules to ensure responses follow core principles
 * @param response Initial response
 * @param userInput Original user input
 * @param messageCount Current message count
 * @param conversationHistory Recent conversation history
 * @returns Enhanced response that follows all unconditional rules
 */
export const applyUnconditionalRules = (
  response: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = []
): string => {
  // Early conversation requires acknowledging everyday concerns first
  if (messageCount <= 10) {
    // Extract topics from user input for accurate acknowledgment
    const topics = extractTopicsFromInput(userInput);
    
    // Check if the response already acknowledges the user's concern
    const hasAcknowledgment = /sounds|seems|understand|hear you|that's|frustrating|challenging|difficult|tough|stressful|I understand/i.test(response);
    
    // For very early messages (first 3), ensure we directly acknowledge the main topic
    if (messageCount <= 3 && topics.length > 0 && !hasAcknowledgment) {
      const mainTopic = topics[0];
      const acknowledgment = getTopicAcknowledgment(mainTopic);
      
      // Add acknowledgment to the beginning of the response if not present
      return `${acknowledgment} ${response}`;
    }
  }
  
  return response;
};

/**
 * Enhance response with rapport-building elements based on conversation state
 * @param response Initial response
 * @param userInput Original user input
 * @param messageCount Current message count
 * @param conversationHistory Recent conversation history
 * @returns Enhanced response with improved rapport elements
 */
export const enhanceResponseWithRapport = (
  response: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = []
): string => {
  // First identify any immediate concerns that need addressing
  const immediateConcern = identifyImmediateConcern(userInput);
  
  // For early conversation (first 5 messages), prioritize precision and warmth
  if (messageCount <= 5) {
    // Detect emotional state for more accurate responses
    const emotionalState = detectSimpleNegativeState(userInput);
    
    // If user expresses a clear emotional state, ensure it's acknowledged
    if (emotionalState.isNegativeState && 
        emotionalState.explicitFeelings && 
        emotionalState.explicitFeelings.length > 0) {
      
      const feeling = emotionalState.explicitFeelings[0];
      
      // Only add if the response doesn't already acknowledge the emotion
      if (!response.toLowerCase().includes(feeling.toLowerCase())) {
        return `I hear that you're feeling ${feeling}. ${response}`;
      }
    }
    
    // If there's an immediate concern, ensure the response addresses it first
    if (immediateConcern && !response.toLowerCase().includes(immediateConcern.replace('_', ' '))) {
      const concernAcknowledgment = getConcernAcknowledgment(immediateConcern);
      
      // Only add if the response doesn't already address the concern
      if (!response.toLowerCase().includes(concernAcknowledgment.toLowerCase().substring(0, 20))) {
        return `${concernAcknowledgment} ${response}`;
      }
    }
    
    // Check for everyday topics that need immediate acknowledgment
    for (const topic of extractEverydayTopics(userInput)) {
      if (!response.toLowerCase().includes(topic.toLowerCase())) {
        const topicAcknowledgment = getEverydayTopicAcknowledgment(topic);
        
        // Only add if the response doesn't already acknowledge the topic
        if (!response.toLowerCase().includes(topicAcknowledgment.toLowerCase().substring(0, 15))) {
          return `${topicAcknowledgment} ${response}`;
        }
      }
    }
  }
  
  // For slightly more established conversations (messages 6-10), add more personalization
  if (messageCount > 5 && messageCount <= 10) {
    // Extract any context from previous messages to ensure continuity
    try {
      const context = extractConversationContext(userInput, conversationHistory);
      
      // If we have good context and the response doesn't reference it, add a reference
      if (context && context.hasContext && 
          (context.locations?.length > 0 || context.topics?.length > 0) &&
          Math.random() < 0.6) {
        
        // Get the most relevant topic or location
        const relevantItem = context.topics?.[0] || context.locations?.[0];
        
        if (relevantItem && !response.toLowerCase().includes(relevantItem.toLowerCase())) {
          return `Continuing with what you shared about ${relevantItem}, ${response}`;
        }
      }
    } catch (error) {
      // Silent error handling to avoid disrupting the conversation
      console.error("Error processing conversation context:", error);
    }
  }
  
  return response;
};

/**
 * Extract key topics from user input for contextual responses
 */
const extractTopicsFromInput = (input: string): string[] => {
  const topics = [];
  const topicPatterns = [
    { regex: /wrench|tool|lost|find|found|missing/i, topic: "losing your wrench" },
    { regex: /storm|electricity|power|outage/i, topic: "the power outage" },
    { regex: /presentation|work|job|boss|meeting|deadline/i, topic: "your work situation" },
    { regex: /laptop|computer|device|phone|mobile/i, topic: "technology issues" },
    { regex: /frustrat(ed|ing)|upset|angry|mad|stress(ed|ful)/i, topic: "your frustration" },
    { regex: /anxious|anxiety|worry|concern/i, topic: "your anxiety" },
    { regex: /sad|down|depress(ed|ing)|unhappy/i, topic: "your feelings" },
    { regex: /spill(ed)?|drink|accident|mess/i, topic: "spilling your drink" },
    { regex: /guilt(y)?|embarrass(ed|ing)|ashamed|regret/i, topic: "feeling guilty" },
    { regex: /bad day|rough day|terrible day|awful day/i, topic: "having a bad day" }
  ];
  
  for (const pattern of topicPatterns) {
    if (pattern.regex.test(input.toLowerCase()) && !topics.includes(pattern.topic)) {
      topics.push(pattern.topic);
    }
  }
  
  // If no specific topics were found, try to extract general ones
  if (topics.length === 0) {
    const generalPattern = /(?:about|regarding|concerning|with) ([a-z\s]+)/i;
    const match = input.match(generalPattern);
    if (match && match[1] && match[1].trim().split(' ').length <= 3) {
      topics.push(match[1].trim().toLowerCase());
    }
  }
  
  return topics;
};

/**
 * Extract everyday topics that need immediate acknowledgment
 */
const extractEverydayTopics = (input: string): string[] => {
  const topics = [];
  
  // Check for common everyday topics
  if (/work|job|career|office|colleague|coworker|boss|supervisor|meeting/i.test(input)) {
    topics.push("work");
  }
  if (/school|class|teacher|professor|assignment|homework|exam|test|study/i.test(input)) {
    topics.push("school");
  }
  if (/family|parent|mom|dad|mother|father|sibling|brother|sister|child|kid|son|daughter/i.test(input)) {
    topics.push("family");
  }
  if (/relationship|partner|spouse|husband|wife|boyfriend|girlfriend|date|dating|marriage/i.test(input)) {
    topics.push("relationship");
  }
  if (/friend|buddy|pal|friendship|social|hang out|gathering|party/i.test(input)) {
    topics.push("friends");
  }
  
  return topics;
};

/**
 * Get an appropriate acknowledgment for a topic
 */
const getTopicAcknowledgment = (topic: string): string => {
  const acknowledgments = [
    `I hear that you're dealing with ${topic}.`,
    `It sounds like ${topic} is on your mind right now.`,
    `I understand that ${topic} is what's concerning you.`,
    `I'm hearing that you're focused on ${topic} at the moment.`
  ];
  
  return acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
};

/**
 * Get an acknowledgment for an immediate concern
 */
const getConcernAcknowledgment = (concern: string): string => {
  switch (concern) {
    case "wait_time":
      return "I understand waiting can be frustrating.";
    case "pre_session_anxiety":
      return "It's completely normal to feel nervous before a session.";
    case "first_visit":
      return "First visits can bring up a mix of emotions.";
    case "payment_concerns":
      return "Financial considerations are definitely important.";
    default:
      return "I hear your concern.";
  }
};

/**
 * Get an acknowledgment for everyday topics
 */
const getEverydayTopicAcknowledgment = (topic: string): string => {
  switch (topic) {
    case "work":
      return "Work situations can definitely be challenging.";
    case "school":
      return "School pressures can really add up.";
    case "family":
      return "Family dynamics can be complex.";
    case "relationship":
      return "Relationships take a lot of navigation.";
    case "friends":
      return "Friendship situations can be meaningful and sometimes difficult.";
    default:
      return `That sounds like an important aspect of your life.`;
  }
};
