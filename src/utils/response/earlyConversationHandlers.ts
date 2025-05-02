
import { isIntroduction, generateIntroductionResponse, isSmallTalk, isPersonalSharing, generatePersonalSharingResponse } from '../../utils/masterRules';
import { generateReflectionResponse } from '../reflection';
import { generateSmallTalkResponse, isLikelyChild, isLikelyNewcomer } from '../conversation/smallTalk';
import { ConversationStage } from '../../hooks/response/conversationStageManager';
import { detectDevelopmentalStage } from '../reflection/reflectionStrategies';
import { shouldUseConversationStarter, generateConversationStarterResponse } from '../reflection/ageAppropriateConversation';
import { getRogerPerspectivePhrase } from './personalityHelpers';
import { createOhioContextResponse } from './handlers';
import { 
  shouldUseWaitingRoomEngagement, 
  generateWaitingRoomEngagement,
  isLikelyTeen,
  isLikelyMale,
  isLikelyBlueCollar,
  mightPreferSimpleLanguage,
  getAppropriateConversationStyle
} from '../conversation/earlyEngagement';

// Import the functions from their specific modules to avoid conflicts
import { generateCulturalConnectionPrompt } from '../conversation/earlyEngagement/culturalConnector';
import { 
  incorporateRogerPersonality,
  generateConnectionStatement,
  generateTransitionToEric
} from '../conversation/earlyEngagement/personalityUtilization';

/**
 * Handles the logic for early conversation responses
 */
export const handleEarlyConversation = (
  userInput: string, 
  conversationStage: ConversationStage,
  messageCount: number,
  introductionMade: boolean,
  adaptiveResponseFn: (userInput: string) => string
): string | null => {
  // Check for introductions if this is the first interaction
  if (isIntroduction(userInput) && !introductionMade) {
    return generateIntroductionResponse();
  }
  
  // Check for child or newcomer patterns to adapt our response approach
  const isChild = isLikelyChild(userInput);
  const isNewcomer = isLikelyNewcomer(userInput);
  const isTeen = isLikelyTeen(userInput);
  const isMale = isLikelyMale(userInput);
  const isBlueCollar = isLikelyBlueCollar(userInput);
  const preferSimpleLanguage = mightPreferSimpleLanguage(userInput);
  
  // Get the appropriate conversation style
  const conversationStyle = getAppropriateConversationStyle(userInput);
  
  // Check for Ohio-specific contexts to create more locally-aware responses
  // This helps Roger connect through regional knowledge
  const ohioContextResponse = createOhioContextResponse(userInput);
  if (ohioContextResponse) {
    return ohioContextResponse;
  }

  // Check if we should use waiting room engagement (first 1-10 messages)
  // This is our new priority for early conversation to keep patients engaged
  if (shouldUseWaitingRoomEngagement(userInput, messageCount)) {
    // Determine if Eric is likely running behind based on keywords
    const isRunningBehind = /wait(ing)?|how long|when|delayed|late/i.test(userInput);
    const isCrisisDelay = /emergency|urgent|crisis/i.test(userInput);
    
    const waitingRoomResponse = generateWaitingRoomEngagement(messageCount, isRunningBehind, isCrisisDelay);
    
    // Add a cultural connection prompt if appropriate
    const culturalPrompt = generateCulturalConnectionPrompt(userInput, messageCount);
    if (culturalPrompt) {
      return `${waitingRoomResponse} ${culturalPrompt}`;
    }
    
    // Add a connection statement if no cultural prompt was added
    const connectionStatement = generateConnectionStatement(userInput, messageCount);
    if (connectionStatement) {
      return `${waitingRoomResponse} ${connectionStatement}`;
    }
    
    // Add a personality note if no other additions were made
    const personalityNote = incorporateRogerPersonality(userInput, messageCount);
    if (personalityNote) {
      return `${waitingRoomResponse} ${personalityNote}`;
    }
    
    // Add a transition statement if approaching end of waiting time
    const transitionNote = generateTransitionToEric(messageCount);
    if (transitionNote) {
      return `${waitingRoomResponse} ${transitionNote}`;
    }
    
    return waitingRoomResponse;
  }
  
  // Process any personal sharing with explicit feelings
  if (isPersonalSharing(userInput)) {
    const personalResponse = generatePersonalSharingResponse(userInput);
    
    // Add cultural connection for personal sharing if appropriate
    const culturalPrompt = generateCulturalConnectionPrompt(userInput, messageCount);
    if (culturalPrompt && messageCount <= 7) {
      return `${personalResponse} ${culturalPrompt}`;
    }
    
    // Add connection statement if appropriate
    const connectionStatement = generateConnectionStatement(userInput, messageCount);
    if (connectionStatement) {
      return `${personalResponse} ${connectionStatement}`;
    }
    
    // Occasionally add Roger's perspective to personal sharing responses
    const perspectivePhrase = getRogerPerspectivePhrase(userInput, messageCount);
    if (perspectivePhrase) {
      return personalResponse + perspectivePhrase;
    }
    return personalResponse;
  }
  
  // Detect developmental stage for age-appropriate responses
  const developmentalStage = detectDevelopmentalStage(userInput);
  
  // Check if we should use a conversation starter based on context
  if (shouldUseConversationStarter(messageCount, userInput) && developmentalStage) {
    const conversationStarter = generateConversationStarterResponse(developmentalStage);
    return `${adaptiveResponseFn(userInput)} ${conversationStarter}`;
  }
  
  // First try a reflection response for early conversation
  const reflectionResponse = generateReflectionResponse(userInput, conversationStage, messageCount);
  if (reflectionResponse) {
    // Add personality note to reflection responses in early conversation
    if (messageCount <= 10) {
      const personalityNote = incorporateRogerPersonality(userInput, messageCount);
      if (personalityNote) {
        return `${reflectionResponse} ${personalityNote}`;
      }
      
      // Add connection statement if appropriate
      const connectionStatement = generateConnectionStatement(userInput, messageCount);
      if (connectionStatement) {
        return `${reflectionResponse} ${connectionStatement}`;
      }
    }
    return reflectionResponse;
  }
  
  // Enhanced check for small talk with improved detection
  if (isSmallTalk(userInput)) {
    // Use Cleveland-aware small talk responses for more natural conversation
    return generateSmallTalkResponse(userInput, messageCount);
  }
  
  // Use adaptive response as last resort in early conversation
  const response = adaptiveResponseFn(userInput);
  
  // Add connection statement if appropriate
  const connectionStatement = generateConnectionStatement(userInput, messageCount);
  if (connectionStatement) {
    return `${response} ${connectionStatement}`;
  }
  
  // Occasionally add Roger's perspective
  const perspectivePhrase = getRogerPerspectivePhrase(userInput, messageCount);
  if (perspectivePhrase && !isChild) { // Skip perspective phrases for children
    return response + perspectivePhrase;
  }
  
  return response;
};
