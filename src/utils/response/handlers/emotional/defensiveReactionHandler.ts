
import { detectDefensiveReaction } from '../../../../utils/safetySupport';
import { generateDeescalationResponse } from '../../../../utils/responseUtils';

/**
 * Detects and responds to defensive reactions to mental health suggestions
 * @param userInput The user's message
 * @returns Response or null if no defensive reaction detected
 */
export const createDefensiveReactionResponse = (userInput: string): string | null => {
  // Detect if the user's message contains a defensive reaction
  const defensiveReaction = detectDefensiveReaction(userInput);
  
  if (!defensiveReaction.isDefensive) {
    return null;
  }
  
  // Ensure we're using reaction types that match the expected types
  const validReactionType = (() => {
    const type = defensiveReaction.reactionType || 'denial';
    // Map any non-standard types to standard ones
    if (type === 'accusation' || type === 'profanity' || type === 'dismissal') {
      return 'anger'; // Map these to 'anger' as closest match
    }
    return type;
  })();
  
  // If we have a defensive reaction, generate a de-escalation response
  return generateDeescalationResponse(
    validReactionType as 'denial' | 'anger' | 'bargaining' | 'minimization',
    defensiveReaction.suggestedConcern || ''
  );
};
