
/**
 * Response Integration
 * 
 * Advanced utilities for enhancing response quality and consistency
 * with improved prioritization of early conversation acknowledgments
 */

import { identifyImmediateConcern } from '../conversation/theSmallStuff/immediateConcrernHandler';
import { detectSimpleNegativeState } from '../conversationalUtils';
import { extractConversationContext } from '../conversationEnhancement/repetitionDetector';

/**
 * Apply unconditional rules to ensure responses follow core principles
 * Enhanced with stronger enforcement of early conversation acknowledgment
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
  // HIGHEST PRIORITY: Early conversation requires acknowledging everyday concerns first
  // This is crucial for the first 10 interactions
  if (messageCount <= 10) {
    // Extract topics from user input for accurate acknowledgment
    const topics = extractTopicsFromInput(userInput);
    
    // Check if the response already acknowledges the user's concern
    const hasAcknowledgment = /sounds|seems|understand|hear you|that's|frustrating|challenging|difficult|tough|stressful|I understand/i.test(response);
    
    // For very early messages (first 3), ensure we directly acknowledge the main topic
    // This directly addresses the issue in the examples provided
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
 * Now with stronger priority on emotional acknowledgment in early conversation
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
  
  // CRITICAL: For early conversation (first 3 messages), prioritize precision and warmth
  if (messageCount <= 3) {
    // Detect emotional state for more accurate responses
    const emotionalState = detectSimpleNegativeState(userInput);
    
    // If user expresses a clear emotional state, ensure it's acknowledged
    // This directly addresses the issue in the examples provided
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
  
  // For slightly more established conversations (messages 4-10), add more personalization
  if (messageCount > 3 && messageCount <= 10) {
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
 * Enhanced with more precise pattern matching for better topic extraction
 */
const extractTopicsFromInput = (input: string): string[] => {
  const topics = [];
  
  // Enhanced topic patterns with more specific and comprehensive matches
  const topicPatterns = [
    { regex: /wrench|tool|lost|find|found|missing|misplaced|can't find/i, topic: "losing your wrench" },
    { regex: /storm|electricity|power|outage|utility|electric company/i, topic: "the power outage" },
    { regex: /presentation|work|job|boss|meeting|deadline|project|career|office/i, topic: "your work situation" },
    { regex: /laptop|computer|device|phone|mobile|tech|technology/i, topic: "technology issues" },
    { regex: /frustrat(ed|ing)|upset|angry|mad|stress(ed|ful)|irritated|annoyed/i, topic: "your frustration" },
    { regex: /anxious|anxiety|worry|concern|nervous|on edge|tension/i, topic: "your anxiety" },
    { regex: /sad|down|depress(ed|ing)|unhappy|blue|low|melancholy/i, topic: "your feelings" },
    { regex: /spill(ed)?|drink|accident|mess|knocked over|clumsy/i, topic: "spilling your drink" },
    { regex: /guilt(y)?|embarrass(ed|ing)|ashamed|regret|sorry|apology/i, topic: "feeling guilty" },
    { regex: /bad day|rough day|terrible day|awful day|tough day|difficult day/i, topic: "having a bad day" },
    { regex: /wait(ing)?|late|delay|appointment|doctor|eric|how long/i, topic: "waiting for your appointment" }
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
 * Enhanced with more comprehensive pattern matching
 */
const extractEverydayTopics = (input: string): string[] => {
  const topics = [];
  
  // Check for common everyday topics with expanded patterns
  if (/\b(work|job|career|office|colleague|coworker|boss|supervisor|meeting|presentation|deadline|project)\b/i.test(input)) {
    topics.push("work");
  }
  if (/\b(school|class|teacher|professor|assignment|homework|exam|test|study|grade|college|university)\b/i.test(input)) {
    topics.push("school");
  }
  if (/\b(family|parent|mom|dad|mother|father|sibling|brother|sister|child|kid|son|daughter)\b/i.test(input)) {
    topics.push("family");
  }
  if (/\b(relationship|partner|spouse|husband|wife|boyfriend|girlfriend|date|dating|marriage|couple|romantic)\b/i.test(input)) {
    topics.push("relationship");
  }
  if (/\b(friend|buddy|pal|friendship|social|hang out|gathering|party|meetup)\b/i.test(input)) {
    topics.push("friends");
  }
  // New pattern for spilling
  if (/\b(spill|drink|accident|mess|knocked over|clumsy)\b/i.test(input)) {
    topics.push("accident");
  }
  
  return topics;
};

/**
 * Get an appropriate acknowledgment for a topic
 * Enhanced with more empathetic and specific acknowledgments
 */
const getTopicAcknowledgment = (topic: string): string => {
  // More specific acknowledgments for common scenarios
  if (topic === "spilling your drink") {
    return "I hear that you're upset about spilling your drink. That kind of small accident can definitely bring up feelings of embarrassment or guilt.";
  }
  
  if (topic === "feeling guilty") {
    return "I hear that you're feeling guilty. Those feelings can be really uncomfortable to sit with.";
  }
  
  if (topic === "having a bad day") {
    return "I'm sorry to hear you're having a bad day. Sometimes days just don't go as planned.";
  }
  
  // General acknowledgments with more warmth and precision
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
 * Enhanced with more specific and empathetic responses
 */
const getConcernAcknowledgment = (concern: string): string => {
  switch (concern) {
    case "wait_time":
      return "I understand waiting can be frustrating. Thanks for your patience.";
    case "pre_session_anxiety":
      return "It's completely normal to feel nervous before a session. Many people experience that.";
    case "first_visit":
      return "First visits can bring up a mix of emotions. I'm glad you're here.";
    case "payment_concerns":
      return "Financial considerations are definitely important. I understand your concern about that.";
    case "spill_incident":
      return "Accidents like spills happen to everyone. I understand that can be frustrating.";
    case "spill_emotional_impact":
      return "I hear that you're upset about the spill. Those small accidents can sometimes trigger bigger feelings.";
    case "feeling_guilty":
      return "Feeling guilty can be really uncomfortable. Thank you for sharing that with me.";
    case "bad_day":
      return "I'm sorry to hear you're having a rough day. That's never easy.";
    case "lost_item":
      return "Losing something important can be really frustrating. I understand why that would be upsetting.";
    default:
      return "I hear your concern. Thank you for sharing that with me.";
  }
};

/**
 * Get an acknowledgment for everyday topics
 * Enhanced with more specific and empathetic responses
 */
const getEverydayTopicAcknowledgment = (topic: string): string => {
  switch (topic) {
    case "work":
      return "Work situations can definitely be challenging. I understand why that would be on your mind.";
    case "school":
      return "School pressures can really add up. That sounds stressful.";
    case "family":
      return "Family dynamics can be complex. I appreciate you sharing about that.";
    case "relationship":
      return "Relationships take a lot of navigation. I understand why that would be important to you.";
    case "friends":
      return "Friendship situations can be meaningful and sometimes difficult. I hear that's on your mind.";
    case "accident":
      return "Even small accidents like spills can bring up strong feelings. I understand why that would be bothering you.";
    default:
      return `That sounds like an important aspect of your life. I'd like to hear more about it.`;
  }
};
