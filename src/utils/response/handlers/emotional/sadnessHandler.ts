
import { distinguishSadnessFromDepression } from '../../../detectionUtils';
import { identifyEnhancedFeelings } from '../../../reflection/feelingDetection';

/**
 * Creates a response for sadness that is appropriately tailored to whether it's normal sadness
 * or clinical depression based on content analysis
 */
export const createSadnessResponse = (userInput: string): string | null => {
  // First check if the content has sadness/depression themes
  const sadnessDistinction = distinguishSadnessFromDepression(userInput);
  if (!sadnessDistinction.isSadness && !sadnessDistinction.isDepression) {
    return null; // No sadness/depression detected
  }
  
  // For clinical depression, we should defer to the mental health concern handler
  if (sadnessDistinction.isDepression) {
    return null; // Will be handled by mental health concern path
  }
  
  // For normal sadness, provide an empathetic reflection
  const enhancedFeelings = identifyEnhancedFeelings(userInput);
  const specificFeeling = enhancedFeelings.find(f => f.category === 'sad')?.detectedWord || 'sad';
  
  // Check for specific spouse/relationship keywords
  const hasRelationshipTerms = /wife|husband|spouse|partner|marriage|divorce|left me|broke up|relationship|ex-/i.test(userInput);
  
  if (hasRelationshipTerms) {
    return `I can hear that you're feeling ${specificFeeling} about this relationship situation. That's completely understandable. When someone significant in our lives leaves, it can be incredibly painful. Would you like to talk more about what you're going through right now?`;
  }
  
  switch (sadnessDistinction.context) {
    case 'grief':
      return `I can hear that you're feeling ${specificFeeling} about this loss. Grief is a natural response when we lose someone or something important to us. Would it help to talk more about what this loss means to you?`;
    case 'relationship':
      return `It sounds like you're feeling ${specificFeeling} about this relationship situation. That's a completely normal reaction. Relationship challenges can be really difficult. How are you taking care of yourself through this?`;
    case 'work':
      return `I'm hearing that you're feeling ${specificFeeling} about this work situation. That's understandable - our work is often closely tied to our sense of identity and security. What thoughts have you had about next steps?`;
    default:
      return `It sounds like you're feeling ${specificFeeling} right now. That's a normal emotion that everyone experiences sometimes. Would it help to talk more about what's contributing to this feeling?`;
  }
};
