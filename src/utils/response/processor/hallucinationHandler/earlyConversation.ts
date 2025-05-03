
/**
 * Early Conversation RAG
 * 
 * Special handling for early conversation stages to avoid
 * hallucinations about previous interactions
 */

/**
 * Apply early conversation RAG (Retrieval Augmented Generation)
 * that avoids false claims about previous conversations
 */
export const applyEarlyConversationRAG = (
  response: string,
  userInput: string
): string => {
  // Remove any false continuity claims
  let modified = response
    .replace(/as we've been discussing/gi, "based on what you're sharing")
    .replace(/our previous conversation/gi, "what you've shared")
    .replace(/we've been focusing on/gi, "regarding")
    .replace(/as I mentioned (earlier|before|previously)/gi, "")
    .replace(/continuing (from|with) (where we left off|our previous)/gi, "focusing on");
  
  // Replace memory claims with present-focused language
  modified = modified
    .replace(/you (mentioned|said|told me) that/gi, "it sounds like")
    .replace(/earlier you (mentioned|said|indicated)/gi, "you just shared")
    .replace(/as you mentioned/gi, "from what you're saying")
    .replace(/we (discussed|talked about)/gi, "regarding")
    .replace(/I remember you saying/gi, "I understand")
    .replace(/from our previous conversation/gi, "from what you've shared");
  
  // Add hedging language for early conversations
  if (!modified.startsWith("It sounds like") && !modified.startsWith("I understand")) {
    modified = "Based on what you're sharing, " + modified;
  }
  
  return modified;
};
