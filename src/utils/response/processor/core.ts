
/**
 * Core response processing
 * 
 * Basic processing that happens for all responses
 */

/**
 * Process a response with core rules that apply to all responses
 */
export const processCore = (
  responseText: string,
  userInput: string,
  messageCount: number = 0,
  conversationHistory: string[] = []
): string => {
  try {
    // Apply basic processing
    let processedResponse = responseText;
    
    // Remove any model confusion markers
    processedResponse = removeConfusionMarkers(processedResponse);
    
    // Ensure response doesn't claim to be a bot/AI/model
    processedResponse = ensureRogerIdentity(processedResponse);
    
    // Apply length constraints for very long responses
    if (processedResponse.length > 800) {
      processedResponse = truncateResponse(processedResponse, 600);
    }
    
    return processedResponse;
  } catch (error) {
    console.error("Error in core processing:", error);
    return responseText;
  }
};

/**
 * Remove confusion markers from responses
 */
const removeConfusionMarkers = (response: string): string => {
  // Remove "As an AI" phrases
  let processed = response.replace(/as an (AI|artificial intelligence|language model|chatbot|assistant)/gi, "");
  
  // Remove "I don't have personal experiences" phrases
  processed = processed.replace(/I don't have (personal|real|actual|human) (experiences|feelings|emotions|opinions|thoughts)/gi, "");
  
  // Remove "I'm not capable of" phrases
  processed = processed.replace(/I('m| am) not (capable of|able to) (having|experiencing|feeling)/gi, "");
  
  // Clean up any resulting awkward spaces
  processed = processed.replace(/\s{2,}/g, " ").trim();
  
  return processed;
};

/**
 * Ensure response maintains Roger's identity
 */
const ensureRogerIdentity = (response: string): string => {
  // Replace "As an AI" with Roger-appropriate phrasing
  return response
    .replace(/As an AI/gi, "As a peer support specialist")
    .replace(/I'm an AI/gi, "I'm Roger, a peer support specialist")
    .replace(/I am an AI/gi, "I am Roger, a peer support specialist");
};

/**
 * Truncate response to a reasonable length
 */
const truncateResponse = (response: string, targetLength: number): string => {
  // If already shorter than target, return as is
  if (response.length <= targetLength) {
    return response;
  }
  
  // Find sentence boundaries
  const sentences = response.split(/(?<=[.!?])\s+/);
  let result = "";
  
  // Add sentences until we approach the target length
  for (const sentence of sentences) {
    if (result.length + sentence.length <= targetLength) {
      result += sentence + " ";
    } else {
      break;
    }
  }
  
  return result.trim();
};

export default processCore;
