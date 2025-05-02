
import { MessageType } from '../../../components/Message';
import { createMessage } from '../../../utils/messageUtils';
import { ConcernType } from '../../../utils/reflection/reflectionTypes';

/**
 * Handles final processing steps for the response before returning it
 */
export const finalizeResponse = (
  responseText: string,
  ensureResponseCompliance: (response: string) => string,
  addToResponseHistory: (response: string) => void,
  concernType: ConcernType
): MessageType => {
  // Apply master rules to ensure no repetition
  let text = ensureResponseCompliance(responseText);
  
  // Add this response to the history to prevent future repetition
  addToResponseHistory(text);
  
  // Create response message
  return createMessage(text, 'roger', concernType);
};
