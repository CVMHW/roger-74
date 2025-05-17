
/**
 * Crisis detection handling in user messages
 */

import { checkForCrisisContent, detectMultipleCrisisTypes, CrisisType } from '../../../chat/crisisDetection';
import { ConcernType } from '../../../../utils/reflection/reflectionTypes';
import { createMessage } from '../../../../utils/messageUtils';
import { MessageType } from '../../../../components/Message';
import { getCrisisResponse } from '../../../../utils/crisis/crisisResponseCoordinator';
import { recordToMemorySystems } from '../memoryHandler';

/**
 * Handles crisis detection in user messages
 * 
 * @param userInput User's original message
 * @param updateStage Function to update conversation stage
 * @returns Crisis response message if crisis detected, null otherwise
 */
export const handleCrisisDetection = (
  userInput: string,
  updateStage: () => void
): MessageType | null => {
  if (!userInput || typeof userInput !== 'string') {
    return null;
  }

  // ENHANCED: MULTI-CRISIS DETECTION
  // Check for multiple crisis types in a single message
  const crisisTypes = detectMultipleCrisisTypes(userInput);
  
  // If multiple crisis types are detected, prioritize suicide first, then others
  if (crisisTypes.length > 0) {
    console.log("MULTI-CRISIS DETECTION: Found crisis types:", crisisTypes);
    
    // Update stage
    updateStage();
    
    let crisisType = crisisTypes[0];
    let crisisTag = `CRISIS:${String(crisisType).toUpperCase()}`;
    
    // Always prioritize suicide if it's one of the detected types
    if (crisisTypes.includes('suicide')) {
      crisisType = 'suicide';
      crisisTag = 'CRISIS:SUICIDE';
    }
    
    // Get appropriate crisis response from coordinator
    const response = getCrisisResponse(crisisType);
    
    try {
      // Record to memory systems with crisis tag
      recordToMemorySystems(userInput, response, crisisTag);
    } catch (error) {
      console.error("Error recording to memory systems:", error);
    }
    
    // Return specific crisis response
    return createMessage(response, 'roger', crisisType as any);
  }
  
  // CRISIS DETECTION - HIGHEST PRIORITY: Always check first before any memory system
  // Check for suicide, self-harm, or other crisis indicators
  if (/suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)|don'?t want to (live|be alive)|take my (own )?life/i.test(userInput.toLowerCase())) {
    console.log("CRITICAL PRIORITY: Detected suicide or self-harm indicators");
    // Update stage
    updateStage();
    
    // Use crisis response
    const response = "I'm very concerned about what you're sharing regarding thoughts of suicide or self-harm. This is serious, and it's important you speak with a crisis professional right away. Please call the 988 Suicide & Crisis Lifeline (call or text 988) immediately, or go to your nearest emergency room. Would you like me to provide additional resources?";
    
    try {
      // Record to memory systems with crisis tag
      recordToMemorySystems(userInput, response, "CRISIS:SUICIDE");
    } catch (error) {
      console.error("Error recording to memory systems:", error);
    }
    
    // Return immediate crisis response
    return createMessage(response, 'roger', 'crisis');
  }
  
  return null;
};
