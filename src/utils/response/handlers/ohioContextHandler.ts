
import { detectOhioReferences, generateOhioContextResponse, mapReferenceToMentalHealthTopic } from '../../conversationEnhancement/ohioContextManager';

/**
 * Creates a response that incorporates Ohio-specific context and references
 * to help Roger connect with patients through local knowledge
 */
export const createOhioContextResponse = (userInput: string, conversationHistory: string[] = []): string | null => {
  try {
    // Detect any Ohio-specific references in the message
    const ohioReferences = detectOhioReferences(userInput);
    
    // If no Ohio references are detected, return null to let other handlers process
    if (!ohioReferences.hasOhioReference) {
      return null;
    }
    
    // Generate an Ohio-relevant response strategy
    const ohioContextStrategy = generateOhioContextResponse(ohioReferences);
    
    // If we should include a local reference, create a response that bridges 
    // Ohio reference to mental health
    if (ohioContextStrategy.shouldIncludeLocalReference) {
      const ohioReference = ohioReferences.detectedLocations[0] || 
                           ohioReferences.detectedCulturalReferences[0];
      
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
    
    return null;
  } catch (e) {
    console.log("Error in Ohio context response generation:", e);
    return null;
  }
};
