
import { MessageType } from '../../../components/Message';
import { ConcernType } from '../../../utils/reflection/reflectionTypes';
import { extractPetType } from '../../../utils/helpers/userInfoUtils';

/**
 * Process pet illness related messages
 */
export const processPetIllnessConcerns = async (
  userInput: string,
  baseProcessUserMessage: (userInput: string, responseFn: (input: string) => string, concernFn: () => ConcernType | null, multiplier?: number) => Promise<MessageType>,
  updateStage: () => void
): Promise<MessageType | null> => {
  try {
    const detectionUtils = await import('../../../utils/detectionUtils');
    
    // Check for pet illness concerns
    if (detectionUtils.detectPetIllnessConcerns(userInput)) {
      // Get specific illness details
      const illnessDetails = detectionUtils.detectSpecificIllness(userInput);
      
      // Generate appropriate response for pet illness
      const petIllnessResponse = detectionUtils.generatePetIllnessResponse({
        petType: extractPetType(userInput),
        illnessType: illnessDetails.illnessType,
        severity: illnessDetails.severity
      });
      
      // Update conversation stage
      updateStage();
      
      // Process with our specific response
      return baseProcessUserMessage(
        userInput,
        () => petIllnessResponse,
        () => 'pet-illness' as ConcernType // Special concern type for pet illness
      );
    }
  } catch (error) {
    console.error("Error checking for illness mentions:", error);
  }
  
  return null;
};
