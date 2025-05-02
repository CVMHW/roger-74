
import { 
  detectOhioReferences, 
  generateOhioContextResponse, 
  mapReferenceToMentalHealthTopic, 
  detectChildPatient, 
  detectNewcomerPatient 
} from '../../../conversationEnhancement/ohio';

/**
 * Creates a response that incorporates Ohio-specific context and references
 * to help Roger connect with patients through local knowledge
 */
export const createOhioContextResponse = (userInput: string, conversationHistory: string[] = []): string | null => {
  try {
    // Detect if user might be a child or newcomer
    const isLikelyChild = detectChildPatient(userInput);
    const isLikelyNewcomer = detectNewcomerPatient(userInput);
    
    // Detect any Ohio-specific references in the message
    const ohioReferences = detectOhioReferences(userInput);
    
    // If no Ohio references are detected, return null to let other handlers process
    if (!ohioReferences.hasOhioReference && !isLikelyChild && !isLikelyNewcomer) {
      return null;
    }
    
    // Generate an Ohio-relevant response strategy
    const ohioContextStrategy = generateOhioContextResponse(ohioReferences);
    
    // If we should include a local reference, create a response that bridges 
    // Ohio reference to mental health
    if (ohioContextStrategy.shouldIncludeLocalReference) {
      // For child-likely patients, prioritize child-friendly references
      if (isLikelyChild && ohioReferences.detectedChildReferences.length > 0) {
        const childReference = ohioReferences.detectedChildReferences[0];
        return ohioContextStrategy.opener;
      }
      
      // For newcomer-likely patients, prioritize newcomer-friendly references
      if (isLikelyNewcomer && ohioReferences.detectedNewcomerReferences.length > 0) {
        const newcomerReference = ohioReferences.detectedNewcomerReferences[0];
        return ohioContextStrategy.opener;
      }
      
      // For general Ohio references
      const ohioReference = ohioReferences.detectedLocations[0] || 
                           ohioReferences.detectedCulturalReferences[0] ||
                           ohioReferences.detectedChildReferences[0] ||
                           ohioReferences.detectedNewcomerReferences[0];
      
      if (ohioReference) {
        const mentalHealthConnection = mapReferenceToMentalHealthTopic(ohioReference);
        return `${ohioContextStrategy.opener}${mentalHealthConnection}`;
      }
    }
    
    // If we have an opener but no specific mental health connection,
    // return just the opener to acknowledge the local reference
    if (ohioContextStrategy.opener) {
      return ohioContextStrategy.opener;
    }
    
    // Fallback for child or newcomer patients without specific Ohio references
    if (isLikelyChild) {
      return "It's nice to meet you! I'm Roger, here to chat while you wait. What kinds of things do you like to do for fun in Cleveland?";
    }
    
    if (isLikelyNewcomer) {
      return "Welcome to Cleveland! I'm Roger. How has your experience been so far getting settled in the area?";
    }
    
    return null;
  } catch (e) {
    console.log("Error in Ohio context response generation:", e);
    return null;
  }
};
