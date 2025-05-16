
import { addToFiveResponseMemory } from '../../../utils/memory/fiveResponseMemory';
import { recordToMemory } from '../../../utils/reflection/feelingDetection';

/**
 * Utility functions for handling memory in Rogerian responses
 */

/**
 * Records both user input and response to the memory systems
 * @param userInput User's original message
 * @param responseText Response text to record
 * @param crisisTag Optional crisis identifier for priority tracking
 */
export const recordToMemorySystems = (userInput: string, responseText: string, crisisTag?: string): void => {
  try {
    // Record to primary memory with crisis tag if available
    if (crisisTag) {
      recordToMemory(`${crisisTag}: ${userInput}`, responseText);
    } else {
      recordToMemory(userInput, responseText);
    }
    
    // Record to 5ResponseMemory system
    addToFiveResponseMemory('patient', userInput);
    addToFiveResponseMemory('roger', responseText);
  } catch (error) {
    console.error("Failed to record to memory systems:", error);
  }
};

/**
 * Records the user input to memory systems in error cases
 */
export const recordErrorToMemorySystems = (userInput: string): void => {
  try {
    // Record to primary memory
    recordToMemory(userInput, "Error processing response");
    
    // Record to 5ResponseMemory even in error case
    addToFiveResponseMemory('patient', userInput);
    addToFiveResponseMemory('roger', "Error processing response");
  } catch (memoryError) {
    console.error("Failed to record to memory during error:", memoryError);
  }
};
