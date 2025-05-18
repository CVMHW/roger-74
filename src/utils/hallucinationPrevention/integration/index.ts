
/**
 * Integration module for hallucination prevention system
 */

// Import the correct functions
import { 
  retrieveAugmentation, 
  augmentResponseWithRetrieval,
  retrieveSimilarResponses,
  addConversationExchange
} from '../retrieval';

// Export them
export { 
  retrieveAugmentation, 
  augmentResponseWithRetrieval,
  addConversationExchange,
  retrieveSimilarResponses
};
