
import { detectEatingDisorderConcerns } from '../../../../utils/conversation/specializedDetection/eatingPatterns/detectors';
import { createEatingDisorderResponse } from '../../../../utils/response/handlers/eatingDisorderHandler';
import { createMessage } from '../../../../utils/messageUtils';
import { MessageType } from '../../../../components/Message';
import { recordToMemorySystems } from '../memoryHandler';

/**
 * Handles eating disorder detection in user messages
 * 
 * @param userInput User's original message
 * @param updateStage Function to update conversation stage
 * @returns Eating disorder response message if detected, null otherwise
 */
export const handleEatingDisorderDetection = (
  userInput: string,
  updateStage: () => void
): MessageType | null => {
  if (!userInput || typeof userInput !== 'string') {
    return null;
  }

  // Check for eating disorder specifically to avoid hallucination - SECOND HIGHEST PRIORITY
  const edResult = detectEatingDisorderConcerns(userInput);
  if (edResult.isEatingDisorderConcern) {
    console.log("HIGH PRIORITY: Detected eating disorder indicators with risk level:", edResult.riskLevel);
    // Update stage
    updateStage();
    
    // Get specialized response
    const edResponse = createEatingDisorderResponse(userInput);
    
    if (edResponse) {
      // Record to memory systems with crisis tag
      recordToMemorySystems(userInput, edResponse, "CRISIS:EATING-DISORDER");
      
      // Return eating disorder response
      return createMessage(edResponse, 'roger', 'eating-disorder');
    }
  }
  
  return null;
};
