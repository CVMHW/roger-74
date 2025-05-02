
import { MessageType } from '../../../components/Message';
import { createMessage } from '../../../utils/messageUtils';
import { ConcernType } from '../../../utils/reflection/reflectionTypes';

/**
 * Handles final processing steps for the response before returning it
 */
export const finalizeResponse = (
  responseText: string,
  ensureResponseCompliance: (response: string) => string,
  addToResponseHistory: (response: string) => void,
  concernType?: ConcernType
): MessageType => {
  try {
    // Check if we have an empty or invalid response - this should never happen!
    if (!responseText || typeof responseText !== 'string' || responseText.trim() === '') {
      console.error("CRITICAL ERROR: Empty or invalid response text received:", responseText);
      
      // Critical safety fallback - ensure we ALWAYS have a response
      // Provide more specific fallbacks based on concern type
      if (concernType === 'tentative-harm') {
        responseText = "I'm concerned about what you're sharing. If you're having thoughts of harming yourself, please know that you're not alone. Would you like me to share some resources that can provide immediate support?";
      } else if (concernType === 'crisis') {
        responseText = "I understand you're going through a difficult time. Your safety matters. Would you like to talk about what's happening or explore some immediate support options?";
      } else {
        responseText = "I'm here to listen and support you. What would you like to talk about?";
      }
    }
    
    // Apply master rules to ensure no repetition
    let text = responseText;
    try {
      text = ensureResponseCompliance(responseText);
    } catch (error) {
      console.error("Error ensuring response compliance:", error);
      // Don't modify text if compliance check fails
    }
    
    // Add this response to the history to prevent future repetition
    try {
      addToResponseHistory(text);
    } catch (error) {
      console.error("Error adding response to history:", error);
    }
    
    // Create response message
    return createMessage(text, 'roger', concernType || null);
  } catch (error) {
    console.error("Error in finalizeResponse:", error);
    
    // Extra safety fallback - We should never reach this point, but if we do, ensure we respond
    if (concernType === 'tentative-harm' || concernType === 'crisis') {
      return createMessage(
        "I'm concerned about what you're sharing. If you're in crisis or having thoughts of self-harm, please reach out to a crisis line or emergency services. I'm here to listen and support you.", 
        'roger',
        concernType
      );
    }
    
    // General fallback
    return createMessage(
      "I'm here to listen. What would you like to talk about?", 
      'roger',
      null
    );
  }
};
