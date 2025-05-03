
import { addToFiveResponseMemory } from '../../../utils/memory/fiveResponseMemory';
import { recordToMemory } from '../../../utils/reflection/feelingDetection';

/**
 * Utility functions for handling memory in Rogerian responses
 */

/**
 * Records both user input and response to the memory systems
 */
export const recordToMemorySystems = (userInput: string, responseText: string): void => {
  try {
    // Record to primary memory
    recordToMemory(userInput, responseText);
    
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
