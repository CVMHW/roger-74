
import { extractConversationContext } from '../conversationEnhancement/repetitionDetector';

/**
 * Generates a response that specifically acknowledges what the user has mentioned
 * to show that Roger is listening and understanding their situation
 */
export const generateContextAcknowledgmentResponse = (userInput: string, conversationHistory: string[]): string => {
  const context = extractConversationContext(userInput, conversationHistory);
  
  if (context.hasContext) {
    // If we have specific contextual information (locations, emotions, topics)
    // generate a response that acknowledges these specific details
    let response = "";
    
    // Acknowledge locations
    if (context.locations.length > 0) {
      if (context.locations.includes("Pakistan") && context.locations.includes("Cleveland")) {
        response = "I understand your move from Pakistan to Cleveland has been challenging. ";
      } else if (context.locations.includes("Pakistan")) {
        response = "I hear that Pakistan is important to you. ";
      } else if (context.locations.includes("Cleveland")) {
        response = "I understand you're in Cleveland now. ";
      }
    }
    
    // Acknowledge specific emotions
    if (context.emotions.length > 0) {
      if (!response) {
        response = `I can hear that you're feeling ${context.emotions[0]} right now. `;
      } else {
        response += `It makes sense you'd feel ${context.emotions[0]} about this. `;
      }
    }
    
    // Acknowledge specific topics
    if (context.topics.includes("language") && context.topics.includes("food") && context.topics.includes("weather")) {
      response += "The combination of language barriers, food differences, and weather changes is a lot to adjust to all at once. ";
    } else {
      if (context.topics.includes("language")) {
        response += "Language barriers can be especially isolating. ";
      }
      if (context.topics.includes("food")) {
        response += "Food is such an important part of feeling at home somewhere. ";
      }
      if (context.topics.includes("weather")) {
        response += "Adjusting to different weather can affect our daily comfort and mood. ";
      }
    }
    
    // Add a relevant follow-up question
    const followUpQuestions = [
      "Which of these changes has been hardest for you?",
      "What have you found helps you feel more connected despite these challenges?",
      "How have these adjustments been affecting your daily life?",
      "What do you miss most about home?",
      "Is there anything that's been easier than expected about this transition?"
    ];
    
    response += followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
    
    return response;
  }
  
  // If no specific context was extracted, fall back to a generic but empathetic response
  return "I hear you're going through some difficult adjustments right now. Could you tell me more about what's been most challenging for you?";
};

/**
 * Helper function to extract location information from user messages
 */
export const extractUserLocation = (currentInput: string, history: string[]): { city?: string; state?: string } | undefined => {
  // Check the current message for location data
  let locationData = extractPossibleLocation(currentInput);
  
  // If no location found in current message, check history
  if (!locationData && history.length > 0) {
    for (let i = history.length - 1; i >= 0; i--) {
      locationData = extractPossibleLocation(history[i]);
      if (locationData) break;
    }
  }
  
  return locationData;
};

/**
 * Helper function to extract location from text
 */
export const extractPossibleLocation = (text: string): { state?: string; city?: string } | undefined => {
  if (!text) return undefined;
  
  try {
    // Try to use the existing function from messageUtils
    const messageUtils = require('../messageUtils');
    if (messageUtils.extractPossibleLocation) {
      return messageUtils.extractPossibleLocation(text);
    }
  } catch (e) {
    console.log("Error using messageUtils for location extraction:", e);
  }
  
  // Fallback implementation
  const lowerText = text.toLowerCase();
  
  // Simple check for Cleveland specifically
  if (lowerText.includes('cleveland')) {
    return { city: 'Cleveland', state: 'Ohio' };
  }
  
  return undefined;
};
