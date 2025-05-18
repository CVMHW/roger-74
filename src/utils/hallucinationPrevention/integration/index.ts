
/**
 * Integration module for hallucination prevention system
 */

// Import the correct functions
import { 
  retrieveAugmentation, 
  augmentResponseWithRetrieval,
  retrieveSimilarResponses
} from '../retrieval';
import { addConversationExchange } from '../conversationTracker';

// Export them
export { 
  retrieveAugmentation, 
  augmentResponseWithRetrieval,
  addConversationExchange,
  retrieveSimilarResponses
};
