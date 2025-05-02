
/**
 * Utilities for determining when and how to use reflections
 */

import { ConversationStage, DevelopmentalStage } from './reflectionTypes';

/**
 * Determines whether a reflection response would be appropriate given the conversation context
 * @param userMessage The user's message
 * @param conversationStage The current stage of the conversation
 * @returns Boolean indicating whether to use a reflection
 */
export const shouldUseReflection = (userMessage: string, conversationStage: ConversationStage): boolean => {
  // More likely to use reflections in early conversation stages
  const stageThresholds = {
    initial: 0.9,  // 90% chance in initial stage
    early: 0.7,    // 70% chance in early stage
    established: 0.5 // 50% chance in established stage
  };
  
  // Base probability on conversation stage
  const baseProb = stageThresholds[conversationStage];
  
  // Increase probability for longer messages (more content to reflect on)
  const lengthFactor = Math.min(userMessage.length / 100, 0.3); // Up to 30% increase for long messages
  
  // Calculate final probability
  const finalProb = Math.min(baseProb + lengthFactor, 0.95); // Cap at 95%
  
  // Random decision based on probability
  return Math.random() < finalProb;
};

/**
 * Detects potential developmental stage based on message content and complexity
 * @param userMessage The user's message
 * @returns Best guess at developmental stage or null if undetermined
 */
export const detectDevelopmentalStage = (userMessage: string): DevelopmentalStage | null => {
  if (!userMessage) return null;
  
  const lowerMessage = userMessage.toLowerCase();
  
  // Basic linguistic markers for different developmental stages
  // These are simplistic and should be enhanced with more sophisticated analysis
  
  // Very simple language, short sentences (3-5 words)
  const simpleChildPatterns = [
    /\bi'm sad\b/i,
    /\bi'm happy\b/i,
    /\bi'm scared\b/i,
    /\bdon't like\b/i,
    /\bwant to play\b/i,
    /\bmy mom\b/i,
    /\bmy dad\b/i,
    /\bdon't want\b/i,
    /\bi want\b/i,
    /\bi can't\b/i
  ];
  
  // Concrete expressions, more descriptive but still straightforward 
  const middleChildPatterns = [
    /\bi feel bad because\b/i,
    /\bmy friends at school\b/i,
    /\bi don't understand why\b/i,
    /\bit's not fair\b/i,
    /\bwhen can i\b/i,
    /\bi tried to\b/i,
    /\bmy teacher said\b/i,
    /\bi'm worried about\b/i
  ];
  
  // Abstract thinking, hypotheticals, complex emotions
  const adolescentPatterns = [
    /\bi'm confused about\b/i,
    /\bthe future\b/i,
    /\bmy identity\b/i,
    /\bmy friends think\b/i,
    /\bi'm not sure who\b/i,
    /\bsociety\b/i,
    /\brelationship\b/i,
    /\bwhat's the point\b/i
  ];
  
  // Count matches for each category
  const simpleMatches = simpleChildPatterns.filter(pattern => pattern.test(lowerMessage)).length;
  const middleMatches = middleChildPatterns.filter(pattern => pattern.test(lowerMessage)).length;
  const adolescentMatches = adolescentPatterns.filter(pattern => pattern.test(lowerMessage)).length;
  
  // Sentence complexity analysis
  const sentences = userMessage.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordCount = sentences.reduce((sum, sentence) => 
    sum + sentence.trim().split(/\s+/).length, 0) / Math.max(1, sentences.length);
  
  // Message length analysis
  const wordCount = userMessage.split(/\s+/).length;
  
  // Very short, simple messages with simple child patterns
  if (avgWordCount < 6 && simpleMatches > 0 && wordCount < 15) {
    return 'young_child';
  }
  
  // Medium complexity with middle childhood patterns
  if (avgWordCount >= 6 && avgWordCount <= 10 && middleMatches > 0) {
    return 'middle_childhood';
  }
  
  // More complex language with adolescent patterns
  if (avgWordCount > 10 && adolescentMatches > 0) {
    return 'adolescent';
  }
  
  // Default to adult if we can't determine
  return 'adult';
};

/**
 * Generates age-appropriate reflection based on developmental stage
 * @param message The user's message 
 * @param feeling The detected feeling
 * @param developmentalStage The identified developmental stage
 * @returns Age-appropriate reflection
 */
export const generateAgeAppropriateReflection = (
  message: string,
  feeling: string,
  developmentalStage: DevelopmentalStage
): string => {
  switch (developmentalStage) {
    case 'infant_toddler':
      // For caregivers of infants/toddlers
      return `I understand this might be affecting your little one. How are you managing with your child's routine?`;
      
    case 'young_child':
      // Simple, concrete, present-focused
      if (feeling === 'sad') {
        return `You're feeling sad. That happens sometimes. What makes you feel better when you're sad?`;
      } else if (feeling === 'angry') {
        return `You feel mad. That's okay. What happened that made you feel mad?`;
      } else if (feeling === 'anxious') {
        return `You feel worried. That's okay. What are you worried about?`;
      } else if (feeling === 'happy') {
        return `You feel happy! That's great! What made you feel so happy?`;
      } else {
        return `How are you feeling right now? Would you like to talk about it?`;
      }
      
    case 'middle_childhood':
      // Logical, more detailed, still concrete
      if (feeling === 'sad') {
        return `I can see you're feeling sad about this. What happened that made you feel this way?`;
      } else if (feeling === 'angry') {
        return `You sound frustrated with this situation. What part bothers you the most?`;
      } else if (feeling === 'anxious') {
        return `It sounds like you're worried. What are you most concerned about?`;
      } else if (feeling === 'happy') {
        return `That sounds like it was a really positive experience for you! What was your favorite part?`;
      } else {
        return `I'm interested in hearing more about how you're feeling about this. Can you tell me more?`;
      }
      
    case 'adolescent':
      // More abstract, identity-focused, future-oriented
      if (feeling === 'sad') {
        return `I'm hearing that you're feeling down about this. How has this been affecting you?`;
      } else if (feeling === 'angry') {
        return `It sounds like this situation is really frustrating for you. What do you think would make it better?`;
      } else if (feeling === 'anxious') {
        return `It seems like you're concerned about this. What thoughts are coming up for you when you think about it?`;
      } else if (feeling === 'happy') {
        return `That sounds like a really positive experience! How did that affect how you see things?`;
      } else {
        return `I'm interested in understanding more about how you're processing this. Would you like to share more?`;
      }
      
    case 'young_adult':
    case 'adult':
    default:
      // Full complexity, abstract concepts
      if (feeling === 'sad') {
        return `I'm hearing that you're experiencing sadness around this situation. How has this been impacting you?`;
      } else if (feeling === 'angry') {
        return `It sounds like this situation has been frustrating. What aspects have been most challenging for you?`;
      } else if (feeling === 'anxious') {
        return `I understand you're feeling anxious about this. What specific concerns have been on your mind?`;
      } else if (feeling === 'happy') {
        return `It's wonderful to hear you're feeling positive about this experience. What elements have been most meaningful for you?`;
      } else {
        return `I'd like to understand more about how you're feeling about this situation. Would you be comfortable sharing more?`;
      }
  }
};
