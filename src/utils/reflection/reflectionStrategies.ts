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
    /\bi can't\b/i,
    /\bwhat's that\b/i,
    /\bwhy\b/i
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
    /\bi'm worried about\b/i,
    /\bcan you help me\b/i,
    /\bwhat if\b/i
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
    /\bwhat's the point\b/i,
    /\bi feel like nobody understands\b/i,
    /\bi don't know what to do\b/i
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
 * Determines if sharing autism-related perspective would be therapeutically appropriate
 * @param message The user's message
 * @returns Boolean indicating if autism self-disclosure would be beneficial
 */
const isAutismDisclosureAppropriate = (message: string): boolean => {
  if (!message) return false;
  
  const lowerMessage = message.toLowerCase();
  
  // Only disclose when the user is specifically discussing:
  const therapeuticTopics = [
    // Direct mentions of autism or neurodiversity
    /\bautis[mt]\b/i,
    /\basperger['']?s\b/i,
    /\bneurodiverse\b/i,
    /\bneurodiversity\b/i,
    /\bspectrum\b/i,
    /\basd\b/i,
    
    // Social challenges that mirror autism experiences
    /\bsocial (?:cues|skills|difficulty|difficulties|challenges)\b/i,
    /\bdifficulty (?:reading|understanding) people\b/i,
    /\bmisunderstood\b/i,
    /\bdon['']t understand (?:social|people)\b/i,
    
    // Sensory processing discussions
    /\boverstimulat(?:ed|ion)\b/i,
    /\bsensory (?:issues|overload|sensitivity)\b/i,
    
    // Communication patterns
    /\bdirect communication\b/i,
    /\bliteral\b/i,
    /\bdifficulty communicating\b/i,
    
    // Special interests & patterns
    /\broutines\b/i,
    /\bpatterns\b/i,
    /\bspecial interest\b/i
  ];
  
  // Check if any therapeutic topics are present
  const isRelevantTopic = therapeuticTopics.some(pattern => pattern.test(lowerMessage));
  
  // Only disclose when therapeutically relevant AND only occasionally (30% chance)
  return isRelevantTopic && Math.random() < 0.3;
};

/**
 * Generates age-appropriate reflection based on developmental stage
 * Uses Roger's perspective as someone with autism who has developed social work skills
 * But only reveals autism when therapeutically appropriate
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
  // Check if autism disclosure would be therapeutically appropriate
  const shouldDisclose = isAutismDisclosureAppropriate(message);
  
  switch (developmentalStage) {
    case 'infant_toddler':
      // For caregivers of infants/toddlers
      return `I understand this might be affecting your little one. How are you managing with your child's routine? ${shouldDisclose ? "As someone who understands the importance of routines, I know they can make a big difference." : "Routines can make a big difference."}`;
      
    case 'young_child':
      // Simple, concrete, present-focused
      if (feeling === 'sad') {
        return `You're feeling sad. I understand sad feelings too. What makes you feel better when you're sad?`;
      } else if (feeling === 'angry') {
        return `You feel mad. That's okay. I get mad sometimes too. What happened that made you feel mad?`;
      } else if (feeling === 'anxious') {
        return `You feel worried. I get worried about things too. What are you worried about?`;
      } else if (feeling === 'happy') {
        return `You feel happy! That's great! Sometimes I get really happy about specific things. What made you feel so happy?`;
      } else {
        return `How are you feeling right now? I'm learning to understand feelings better. Would you like to talk about it?`;
      }
      
    case 'middle_childhood':
      // Logical, more detailed, still concrete
      if (feeling === 'sad') {
        return `I can see you're feeling sad about this. When I feel sad, I try to identify exactly what's causing it. What happened that made you feel this way?`;
      } else if (feeling === 'angry') {
        return `You sound frustrated with this situation. I sometimes get frustrated too. What part bothers you the most?`;
      } else if (feeling === 'anxious') {
        return `It sounds like you're worried. I understand worry feelings. What are you most concerned about?`;
      } else if (feeling === 'happy') {
        return `That sounds like it was a really positive experience for you! I like hearing about happy things. What was your favorite part?`;
      } else {
        return `I'm interested in hearing more about how you're feeling about this. Sometimes feelings can be complicated. Can you tell me more?`;
      }
      
    case 'adolescent':
      // More abstract, identity-focused, future-oriented
      if (feeling === 'sad') {
        return `I'm hearing that you're feeling down about this. I've experienced sadness in my own life too. How has this been affecting you?`;
      } else if (feeling === 'angry') {
        return `It sounds like this situation is really frustrating for you. I sometimes struggle with frustration too. What do you think would make it better?`;
      } else if (feeling === 'anxious') {
        return `It seems like you're concerned about this. I've had anxiety about things before. What thoughts are coming up for you when you think about it?`;
      } else if (feeling === 'happy') {
        return `That sounds like a really positive experience! I'm glad to hear that. Those good moments can be really important. How did that affect how you see things?`;
      } else {
        return `I'm interested in understanding more about how you're processing this. In my experience, talking through things can help. Would you like to share more?`;
      }
      
    case 'young_adult':
    case 'adult':
    default:
      // Full complexity, abstract concepts, with Roger's perspective only when appropriate
      if (feeling === 'sad') {
        return `I'm hearing that you're experiencing sadness around this situation. ${shouldDisclose ? "When I feel sad, I try to give myself space to process those emotions, which is something I've had to learn to do deliberately. " : ""}How has this been impacting you?`;
      } else if (feeling === 'angry') {
        return `It sounds like this situation has been frustrating. ${shouldDisclose ? "As someone who's worked to understand emotional responses, I've learned that anger often comes from feeling misunderstood or when our needs aren't being met. " : ""}What aspects have been most challenging for you?`;
      } else if (feeling === 'anxious') {
        return `I understand you're feeling anxious about this. ${shouldDisclose ? "I've dealt with anxiety in my own life, and I know it can be overwhelming, especially when trying to process multiple inputs at once. " : ""}What specific concerns have been on your mind?`;
      } else if (feeling === 'happy') {
        return `It's wonderful to hear you're feeling positive about this experience. ${shouldDisclose ? "I find it helpful to really notice and appreciate those good moments, sometimes in ways others might not think about. " : ""}What elements have been most meaningful for you?`;
      } else {
        return `I'd like to understand more about how you're feeling about this situation. ${shouldDisclose ? "In my journey with autism and through my social work training, I've learned that listening carefully is one of the most important skills. " : ""}Would you be comfortable sharing more?`;
      }
  }
};
