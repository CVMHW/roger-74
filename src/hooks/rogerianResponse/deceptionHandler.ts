
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { MessageType } from '../../components/Message';
import { DeceptionAnalysis } from '../../utils/detectionUtils/deceptionDetection';
import { createMessage } from '../../utils/messageUtils';

/**
 * Handles potential deception in crisis communication
 */
export const handlePotentialDeception = async (
  originalMessage: string,
  followUpMessage: string,
  addToResponseHistory: (response: string) => void
): Promise<MessageType | null> => {
  try {
    // Dynamically import the deception detection module
    const deceptionModule = await import('../../utils/detectionUtils/deceptionDetection');
    
    // Analyze for potential deception
    const deceptionAnalysis = deceptionModule.detectPotentialDeception(
      originalMessage, 
      followUpMessage
    );
    
    // If we detect deception with medium-high confidence, handle according to the unconditional law
    if (deceptionAnalysis.isPotentialDeception && deceptionAnalysis.confidence !== 'low') {
      // Generate appropriate response that explains inpatient stays
      const responseText = deceptionModule.generateDeceptionResponseMessage(deceptionAnalysis);
      
      // Create the message object
      const concernType = mapDeceptionConcernType(deceptionAnalysis);
      const responseMessage = createMessage(responseText, 'roger', concernType);
      
      // Add to response history
      addToResponseHistory(responseText);
      
      return responseMessage;
    }
  } catch (error) {
    console.error("Error in deception detection:", error);
  }
  
  return null;
};

// Map deception concern types to valid ConcernType values
const mapDeceptionConcernType = (analysis: DeceptionAnalysis): ConcernType => {
  switch (analysis.originalConcern) {
    case 'suicide':
    case 'self-harm':
      return 'tentative-harm';
    case 'harm-to-others':
      return 'crisis';
    default:
      return 'crisis';
  }
};
