/**
 * Integration module for hallucination prevention system
 */

// Update imports to use the exported functions from the main index
import { 
  retrieveAugmentation, 
  augmentResponseWithRetrieval,
  addConversationExchange,
  retrieveSimilarResponses
} from '../index';

export { 
  retrieveAugmentation, 
  augmentResponseWithRetrieval,
  addConversationExchange 
};
