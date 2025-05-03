
/**
 * Response Enhancer
 * 
 * Applies enhancements to Roger's responses using the integrated memory
 * and hallucination prevention system
 */

import { processResponseThroughMasterRules } from './responseProcessor';
import { enhanceResponseWithMemory } from './processor/memoryEnhancement';
import { handlePotentialHallucinations } from './processor/hallucinationHandler';
import { recordToMemorySystems } from './processor/memorySystemHandler';
import { retrieveRelevantMemories } from '../memory/memoryBank';
import { getRogerPersonalityInsight } from '../reflection/rogerPersonality';
import { isSmallTalk, isIntroduction, isPersonalSharing } from '../masterRules';

/**
 * Enhance a response with memory integration and hallucination prevention
 */
export const enhanceResponse = (
  response: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = [],
  contextInfo?: {
    isEverydaySituation?: boolean,
    isSmallTalkContext?: boolean,
    isIntroductionContext?: boolean,
    isPersonalSharingContext?: boolean
  }
): string => {
  try {
    // Get relevant memories from the memory bank
    const relevantMemories = retrieveRelevantMemories(userInput);
    
    // Check for everyday situations
    const isEverydaySituation = contextInfo?.isEverydaySituation || 
      /trip(ped)?|spill(ed)?|embarrass(ing|ed)?|awkward|class|teacher|student|bar|drink|fall|fell|stumble|social|party/i.test(userInput);
    
    // Check for master rule contexts
    const isSmallTalkContext = contextInfo?.isSmallTalkContext || isSmallTalk(userInput);
    const isIntroductionContext = contextInfo?.isIntroductionContext || isIntroduction(userInput);
    const isPersonalSharingContext = contextInfo?.isPersonalSharingContext || isPersonalSharing(userInput);
    
    // Check for resistance to deeper meaning
    const resistanceToDeeperMeaning = conversationHistory.some(msg => 
      /what\?|all|that's all|just happened|it was just|how does.*reflect|are you insinuating|not that deep|too much|simple|regular|come on|get real/i.test(msg)
    );
    
    // Apply master rules through the integrated processor
    const masterProcessed = processResponseThroughMasterRules(
      response,
      userInput,
      conversationHistory
    );
    
    // Get Roger's personality insight when appropriate
    let responseWithPersonality = masterProcessed;
    
    // Only add personality perspective when therapeutically appropriate AND not an everyday situation
    if (!isEverydaySituation && !resistanceToDeeperMeaning && !isSmallTalkContext && 
        !isIntroductionContext && Math.random() < 0.3 && messageCount > 3) {
      const personalityInsight = getRogerPersonalityInsight(userInput, '', messageCount >= 30);
      if (personalityInsight && !responseWithPersonality.includes(personalityInsight)) {
        responseWithPersonality += personalityInsight;
      }
    }
    
    // For everyday situations, override all processing with conversational responses
    if (isEverydaySituation || isSmallTalkContext) {
      const casualResponse = createCasualResponse(userInput, responseWithPersonality);
      
      // Record to memory systems
      recordToMemorySystems(
        casualResponse,
        undefined,
        undefined,
        0.8 // High importance for Roger's responses
      );
      
      return casualResponse;
    }
    
    // For other situations, check for potential hallucinations
    const hallucinationResult = handlePotentialHallucinations(
      responseWithPersonality,
      userInput,
      conversationHistory
    );
    
    // Record the final response to memory systems
    recordToMemorySystems(
      hallucinationResult.processedResponse || responseWithPersonality,
      undefined,
      undefined,
      0.8 // High importance for Roger's responses
    );
    
    return hallucinationResult.processedResponse || responseWithPersonality;
  } catch (error) {
    console.error("Error enhancing response:", error);
    return response; // Return original response if enhancement fails
  }
};

/**
 * Create casual conversational response for everyday situations
 */
const createCasualResponse = (userInput: string, existingResponse: string): string => {
  // Check if existing response is already appropriate for casual situation
  if (existingResponse.length < 120 && !containsPhilosophicalTerms(existingResponse)) {
    return existingResponse;
  }
  
  // Create appropriate casual responses based on context
  if (/trip(ped)?|fall|fell|stumble/i.test(userInput)) {
    if (/class|teacher|student|presentation/i.test(userInput)) {
      return "That sounds pretty embarrassing. Most people have had moments like that in front of others. How did the class react?";
    }
    return "Those moments can feel so awkward! Everyone has those embarrassing moments. What happened next?";
  }
  
  if (/spill(ed)?/i.test(userInput)) {
    return "Spilling something can definitely feel awkward in the moment. What happened next?";
  }
  
  if (/embarrass(ing|ed)?|awkward/i.test(userInput)) {
    return "Embarrassing moments like that can feel much bigger to us than they do to others. How are you feeling about it now?";
  }
  
  // Default response for other casual situations
  return "That sounds difficult. Would you like to tell me more about what happened?";
};

/**
 * Check if response contains philosophical or meaning-focused terms
 */
const containsPhilosophicalTerms = (text: string): boolean => {
  return /meaning|purpose|values|deeper|connection to|life patterns|existential|broader perspective/i.test(text);
};

// Add these missing functions that are imported in useResponseHooks.ts
export const processUserMessageMemory = (userInput: string): void => {
  try {
    // Record user message to memory system
    recordToMemorySystems(userInput);
  } catch (error) {
    console.error("Error recording user message to memory:", error);
  }
};

export const checkForResponseRepetition = (
  response: string,
  recentResponses: string[]
): boolean => {
  if (recentResponses.length === 0) return false;
  
  // Simple check for exact repetition
  if (recentResponses.includes(response)) return true;
  
  // Check for high similarity
  for (const prevResponse of recentResponses) {
    // Simple similarity check - if more than 80% of words match
    const responseWords = new Set(response.toLowerCase().split(/\s+/));
    const prevWords = new Set(prevResponse.toLowerCase().split(/\s+/));
    const intersection = [...responseWords].filter(word => prevWords.has(word));
    const similarity = intersection.length / Math.max(responseWords.size, prevWords.size);
    
    if (similarity > 0.8) return true;
  }
  
  return false;
};

export const getRepetitionRecoveryResponse = (): string => {
  const recoveryResponses = [
    "I notice I may have been repeating myself. Let's approach this differently. What aspect of your situation feels most important to address right now?",
    "I want to make sure I'm being helpful. Could you tell me more specifically what you'd like to explore about this?",
    "I realize we might be covering similar ground. What's one thing about this situation that we haven't discussed yet?",
    "Let's shift our focus a bit. What would be most helpful for you to talk about at this moment?",
    "I'd like to understand your experience better. Could you share more about how this situation has been affecting you day to day?"
  ];
  
  return recoveryResponses[Math.floor(Math.random() * recoveryResponses.length)];
};
