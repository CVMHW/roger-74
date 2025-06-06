
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { MessageType } from '../../components/Message';
import { createMessage } from '../../utils/messageUtils';
import { 
  detectSarcasm, 
  generateSarcasmResponse, 
  detectContentConcerns,
  detectRepetition
} from '../../utils/conversationEnhancement/emotionalInputHandler';
import { 
  detectSimpleNegativeState, 
  generateSimpleNegativeStateResponse,
  detectPoliticalEmotions,
  generatePoliticalEmotionResponse 
} from '../../utils/conversationalUtils';
import { 
  extractConversationContext 
} from '../../utils/conversationEnhancement/repetitionDetector';
import { 
  generateContextAcknowledgmentResponse 
} from '../../utils/context/conversationContext';

/**
 * Handles emotional responses and special patterns in user messages
 */
export const handleEmotionalPatterns = async (
  userInput: string, 
  conversationHistory: string[],
  baseProcessUserMessage: (userInput: string, responseFn: (input: string) => string, concernFn: () => ConcernType | null) => Promise<MessageType>,
  detectConcerns: (userInput: string) => ConcernType,
  updateStage: () => void
): Promise<MessageType | null> => {
  try {
    // HIGHEST PRIORITY: Check if user is pointing out that we're not listening
    const notListeningPattern = /already told you|just said that|weren't listening|not listening|didn't hear|didn't read|ignoring|pay attention|listen to me|read what i wrote|i just told you|i said|i mentioned|you asked|you're repeating|you just asked|you already asked/i;
    
    if (notListeningPattern.test(userInput)) {
      // Generate an acknowledgment response with content from previous messages
      let acknowledgmentResponse = "I apologize for not properly acknowledging what you've already shared. ";
      
      // Extract relevant topics from previous messages
      const topics = extractRelevantTopics(conversationHistory);
      if (topics.length > 0) {
        acknowledgmentResponse += `I understand that you mentioned ${topics.join(", ")}. `;
      }
      
      acknowledgmentResponse += "Which aspect of this would be most helpful to focus on right now?";
      
      // Update conversation stage
      updateStage();
      
      // Process with acknowledgment response
      return baseProcessUserMessage(
        userInput,
        () => acknowledgmentResponse,
        () => null
      );
    }
    
    // HIGHEST PRIORITY: Check for sarcasm or frustration directed at Roger
    if (detectSarcasm(userInput) && 
        (userInput.toLowerCase().includes("robot") || 
         userInput.toLowerCase().includes("stupid") ||
         userInput.toUpperCase() === userInput)) {
      const contentInfo = detectContentConcerns(userInput);
      const sarcasmResponse = generateSarcasmResponse(contentInfo);
      
      // Update conversation stage
      updateStage();
      
      // Process with sarcasm response
      return baseProcessUserMessage(
        userInput,
        () => sarcasmResponse,
        () => null
      );
    }
    
    // After any feedback loop detection, check if we have specific context to acknowledge
    if (conversationHistory.length >= 2) {
      try {
        const context = extractConversationContext(userInput, conversationHistory);
        
        if (context && context.hasContext && 
            (context.locations?.length > 0 || context.topics?.length >= 2 || context.keyPhrases?.length > 0) &&
            Math.random() < 0.7) { // 70% chance to use context-aware response when applicable
          
          const contextResponse = generateContextAcknowledgmentResponse(userInput, conversationHistory);
          
          // Update conversation stage
          updateStage();
          
          // Return a context-specific response
          return Promise.resolve(createMessage(contextResponse, 'roger'));
        }
      } catch (error) {
        console.error("Error processing conversation context:", error);
      }
    }
    
    // Check for repeated user concerns that aren't being addressed
    if (conversationHistory.length >= 2) {
      try {
        const repetitionInfo = detectRepetition(userInput, conversationHistory.slice(-3));
        const contentInfo = detectContentConcerns(userInput);
        
        // If user has repeated the same concern multiple times, acknowledge it directly
        if (repetitionInfo && repetitionInfo.isRepeating && repetitionInfo.repetitionCount >= 2 &&
            (userInput.toUpperCase() === userInput || userInput.includes('!') || 
            userInput.toLowerCase().includes("listen") || 
            userInput.toLowerCase().includes("not hearing"))) {
          
          // Update conversation stage
          updateStage();
          
          // Generate a response that directly acknowledges what they've been repeating
          const acknowledgeResponse = contentInfo && contentInfo.hasConcern
            ? `I apologize for not properly addressing your concern about ${contentInfo.specificConcern || contentInfo.category}. I'm listening now. What specific aspect of this is most important for us to focus on?`
            : `I'm sorry for not properly addressing what you've been trying to tell me. I'd like to make sure I understand correctly. Could you help me focus on what's most important?`;
          
          // Process with acknowledgment response
          return baseProcessUserMessage(
            userInput,
            () => acknowledgeResponse,
            () => detectConcerns(userInput)
          );
        }
      } catch (error) {
        console.error("Error detecting repetition:", error);
      }
    }
    
    // NEXT PRIORITY: Check for explicitly stated feelings first
    try {
      const negativeStateInfo = detectSimpleNegativeState(userInput);
      if (negativeStateInfo && negativeStateInfo.isNegativeState) {
        // User has explicitly stated how they feel or is in a negative state - always acknowledge this first
        updateStage();
        
        // Also detect any specific content/concerns mentioned
        const contentInfo = detectContentConcerns(userInput);
        
        // Generate response that acknowledges their stated feelings AND the specific concern
        return baseProcessUserMessage(
          userInput,
          (input) => generateSimpleNegativeStateResponse(input, negativeStateInfo, contentInfo),
          () => null // No concern needed here as we're handling the emotional state directly
        );
      }
    } catch (error) {
      console.error("Error handling negative emotional state:", error);
    }
    
    // Check for political emotions as second highest priority
    try {
      const politicalInfo = detectPoliticalEmotions(userInput);
      if (politicalInfo && politicalInfo.isPolitical) {
        updateStage();
        
        // Process with political emotion response
        return baseProcessUserMessage(
          userInput,
          (input) => generatePoliticalEmotionResponse(input, politicalInfo),
          () => null
        );
      }
    } catch (error) {
      console.error("Error handling political emotions:", error);
    }
    
    // Check for asking if Roger is Drew (unconditional rule)
    if (
      userInput.toLowerCase().includes("are you drew") || 
      userInput.toLowerCase().includes("is your name drew") ||
      userInput.toLowerCase().includes("your name is drew") ||
      userInput.toLowerCase().includes("you're drew") ||
      userInput.toLowerCase().includes("youre drew") ||
      userInput.toLowerCase().includes("you are drew")
    ) {
      // Direct response to redirect focus
      const redirectResponse = "I'm Roger, your peer support companion. My role is to be here for you and focus on your needs and experiences. What would be most helpful for us to explore together today?";
      
      // Update conversation stage before processing
      updateStage();
      
      // Process the usual way but with our specific response
      return baseProcessUserMessage(
        userInput,
        () => redirectResponse,
        () => null
      );
    }
    
    // No special emotional patterns detected
    return null;
  } catch (error) {
    console.error("Error in handleEmotionalPatterns:", error);
    return null;
  }
};

/**
 * Helper function to extract relevant topics from conversation history
 */
const extractRelevantTopics = (history: string[]): string[] => {
  // Only consider user messages (not Roger's responses)
  const userMessages = history.filter(msg => 
    !msg.includes("Roger is") && 
    !msg.includes("I apologize for not") &&
    !msg.includes("I'm here to listen") &&
    !msg.includes("I understand") &&
    !msg.includes("I hear what")
  );
  
  if (userMessages.length === 0) {
    return [];
  }
  
  const topics = [];
  const topicPatterns = [
    { regex: /wrench|tool|lost|find|found|missing/i, topic: "your lost wrench" },
    { regex: /storm|electricity|power|outage/i, topic: "the power outage" },
    { regex: /presentation|work|job|boss|meeting|deadline/i, topic: "your work presentation" },
    { regex: /laptop|computer|device|phone|mobile/i, topic: "technology issues" },
    { regex: /frustrat(ed|ing)|upset|angry|mad|stress(ed|ful)/i, topic: "your frustration" },
    { regex: /anxious|anxiety|worry|concern/i, topic: "your anxiety" },
    { regex: /sad|down|depress(ed|ing)|unhappy/i, topic: "your feelings" },
    { regex: /family|relationship|partner|spouse|marriage/i, topic: "your relationships" },
    { regex: /sleep|tired|exhausted|fatigue/i, topic: "your sleep concerns" }
  ];
  
  // Check each user message for topics
  for (const message of userMessages) {
    for (const pattern of topicPatterns) {
      if (pattern.regex.test(message) && !topics.includes(pattern.topic)) {
        topics.push(pattern.topic);
      }
    }
  }
  
  return topics;
};
