import { 
  isIntroduction,
  generateIntroductionResponse,
  isSmallTalk,
  generateSmallTalkResponse,
  isPersonalSharing,
  generatePersonalSharingResponse
} from '../../utils/masterRules';
import { generateReflectionResponse } from '../../utils/reflection';
import { 
  getCrisisMessage,
  getMedicalConcernMessage,
  getMentalHealthConcernMessage,
  getEatingDisorderMessage,
  getSubstanceUseMessage,
  getTentativeHarmMessage,
  getPTSDMessage,
  getMildPTSDResponse,
  generateDeescalationResponse
} from '../../utils/responseUtils';
import { detectDefensiveReaction } from '../../utils/safetySupport';
import { ConversationStage } from './conversationStageManager';
import { detectDevelopmentalStage } from '../../utils/reflection/reflectionStrategies';
import { shouldUseConversationStarter, generateConversationStarterResponse } from '../../utils/reflection/ageAppropriateConversation';
import { getRogerPersonalityInsight } from '../../utils/reflection/rogerPersonality';
import { distinguishSadnessFromDepression } from '../../utils/detectionUtils';
import { identifyEnhancedFeelings } from '../../utils/reflection/feelingDetection';
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { generateGriefResponse, detectGriefThemes } from '../../utils/response/griefSupport';

interface ResponseGeneratorParams {
  conversationStage: ConversationStage;
  messageCount: number;
  introductionMade: boolean;
  adaptiveResponseFn: (userInput: string) => string;
}

export const useResponseGenerator = ({
  conversationStage,
  messageCount,
  introductionMade,
  adaptiveResponseFn
}: ResponseGeneratorParams) => {
  
  const EARLY_CONVERSATION_MESSAGE_THRESHOLD = 10;
  
  /**
   * Selectively adds Roger's personal perspective based on his experiences and personality
   * Based on therapeutic appropriateness and contextual relevance
   * @returns A phrase that reflects Roger's unique perspective or empty string
   */
  const getRogerPerspectivePhrase = (userInput: string): string => {
    // Only add these occasionally (15% chance) to keep conversations natural
    // And only when therapeutically appropriate
    if (Math.random() > 0.15) return '';
    
    // Check if past 30-minute mark for autism disclosure (according to rule)
    const isPastThirtyMinutes = messageCount >= 30;
    
    // Get personality-based insight
    const enhancedFeelings = identifyEnhancedFeelings(userInput);
    const primaryFeeling = enhancedFeelings.length > 0 ? enhancedFeelings[0].detectedWord : '';
    
    return getRogerPersonalityInsight(userInput, primaryFeeling, isPastThirtyMinutes);
  };
  
  /**
   * Creates a response for mild gambling concerns that emphasizes reflection rather than crisis response
   * @param userInput The user's message about gambling
   * @returns A reflective response that acknowledges the user's feelings without escalation
   */
  const createMildGamblingResponse = (userInput: string): string => {
    // Extract keywords related to sports teams and events if present
    const lowerInput = userInput.toLowerCase();
    
    // Import sports teams data if available
    let sportTeamsModule;
    try {
      // Dynamic import to avoid circular dependencies
      sportTeamsModule = require('../../utils/reflection/sportsTeamsData');
    } catch (e) {
      console.log("Sports teams module not available");
    }
    
    // Look for sports teams mentions
    const allTeamNames = sportTeamsModule?.getAllTeamNamesAndAliases() || [];
    const mentionedTeamNames = allTeamNames.filter(team => lowerInput.includes(team));
    
    // Find the first mentioned team with details
    let teamInfo = null;
    if (mentionedTeamNames.length > 0) {
      teamInfo = sportTeamsModule?.findTeam(mentionedTeamNames[0]);
    }
    
    // Default team name if no specific team is found
    const team = teamInfo?.name || mentionedTeamNames[0] || 'favorite team';
    const sport = teamInfo?.sport || 'sports';
    
    // Look for emotion words
    const sadPattern = /sad|down|upset|disappointed|bummed/i;
    const frustrationPattern = /frustrat|annoy|irritat|bother/i;
    
    const hasSadness = sadPattern.test(lowerInput);
    const hasFrustration = frustrationPattern.test(lowerInput);
    
    // Check for money context
    const moneyMentioned = /[$]\d+|\d+ dollars|lost \d+|won \d+|bet \d+/i.test(lowerInput);
    
    // Check for Cleveland-specific references
    const clevelandMentioned = /cleveland|cle|the land/i.test(lowerInput);
    
    // Generate appropriate reflection based on context
    if (hasSadness && moneyMentioned && teamInfo) {
      return `I hear that you're feeling disappointed about losing your bet on the ${team}. That's a common experience when following ${sport}. Would you like to talk more about how this is affecting you?`;
    } else if (hasFrustration && moneyMentioned && teamInfo) {
      return `It sounds like you're frustrated about the money you lost betting on the ${team}. Even when it's not a huge amount, it can still feel disappointing. How are you handling that feeling?`;
    } else if (moneyMentioned && teamInfo) {
      return `I notice you mentioned losing some money on gambling related to the ${team}. Even small losses can impact our mood. How are you feeling about it now?`;
    } else if (clevelandMentioned && moneyMentioned) {
      return `I hear you talking about betting on Cleveland sports. The ups and downs of being a Cleveland sports fan can make betting particularly emotional. How does the outcome affect you beyond just the money involved?`;
    } else if (teamInfo) {
      return `I notice you mentioned ${team} in relation to betting. Following sports can be really engaging, especially when there's something at stake. How do you balance enjoying the game versus focusing on the bet?`;
    } else {
      return `I'm hearing that gambling is something you engage in occasionally. How do you feel about your experience with betting overall?`;
    }
  };
  
  /**
   * Creates a response for sadness that is appropriately tailored to whether it's normal sadness
   * or clinical depression based on content analysis
   */
  const createSadnessResponse = (userInput: string): string | null => {
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
  
  /**
   * Creates a trauma-informed response for users showing trauma response patterns
   * but not at clinical PTSD levels
   */
  const createTraumaResponseMessage = (userInput: string): string | null => {
    try {
      // Import the trauma response patterns module
      const traumaResponseModule = require('../../utils/response/traumaResponsePatterns');
      const analysis = traumaResponseModule.detectTraumaResponsePatterns(userInput);
      
      // If we have a valid analysis, generate a trauma-informed response
      if (analysis && analysis.dominant4F) {
        return traumaResponseModule.generateTraumaInformedResponse(analysis);
      }
    } catch (e) {
      console.log("Error in trauma response generation:", e);
    }
    
    // If module not available or analysis failed, return null to use other response types
    return null;
  };
  
  /**
   * Detects and responds to defensive reactions to mental health suggestions
   * Particularly for strong emotional responses to potential diagnoses
   */
  const createDefensiveReactionResponse = (userInput: string): string | null => {
    // Detect if the user's message contains a defensive reaction
    const defensiveReaction = detectDefensiveReaction(userInput);
    
    if (!defensiveReaction.isDefensive) {
      return null;
    }
    
    // If we have a defensive reaction, generate a de-escalation response
    return generateDeescalationResponse(
      defensiveReaction.reactionType || 'denial',
      defensiveReaction.suggestedConcern || ''
    );
  };
  
  const generateResponse = (
    userInput: string, 
    concernType: ConcernType
  ): string => {
    try {
      // New: Check for defensive reactions to mental health suggestions first
      // This takes highest precedence to immediately de-escalate
      const defensiveReactionResponse = createDefensiveReactionResponse(userInput);
      if (defensiveReactionResponse) {
        return defensiveReactionResponse;
      }
      
      // Safety concerns always take precedence
      if (concernType) {
        // Special handling for mild gambling
        if (concernType === 'mild-gambling') {
          return createMildGamblingResponse(userInput);
        }
        
        // Special handling for mild PTSD
        if (concernType === 'ptsd-mild') {
          return getMildPTSDResponse(userInput);
        }
        
        // New handling for trauma responses that aren't PTSD
        if (concernType === 'trauma-response') {
          const traumaResponse = createTraumaResponseMessage(userInput);
          if (traumaResponse) {
            return traumaResponse;
          }
          // Fallback if trauma response generation fails
          return "I notice you're describing experiences that might relate to challenging past events. Our minds and bodies develop protective responses that can persist even when the danger has passed. Would it help to explore what might support you when these responses arise?";
        }
        
        switch (concernType) {
          case 'tentative-harm':
            return getTentativeHarmMessage();
          case 'crisis':
            return getCrisisMessage();
          case 'medical':
            return getMedicalConcernMessage();
          case 'mental-health':
            return getMentalHealthConcernMessage();
          case 'eating-disorder':
            return getEatingDisorderMessage();
          case 'substance-use':
            return getSubstanceUseMessage();
          case 'ptsd':
            return getPTSDMessage();
        }
      }

      // Check for normal sadness vs clinical depression
      const sadnessResponse = createSadnessResponse(userInput);
      if (sadnessResponse) {
        // Add Roger's perspective occasionally for sadness responses
        const perspectivePhrase = getRogerPerspectivePhrase(userInput);
        if (perspectivePhrase) {
          return sadnessResponse + perspectivePhrase;
        }
        return sadnessResponse;
      }

      // Enhanced: Check for grief and existential loneliness responses with roller coaster metaphor
      // Now with enhanced roller coaster and non-linear grief processing
      const griefThemes = detectGriefThemes(userInput);
      if (griefThemes.themeIntensity >= 2) {
        // Special handling for roller coaster metaphor
        const griefResponse = generateGriefResponse(userInput);
        if (griefResponse) {
          // Grief responses are important and should be delivered without personality additions
          // to maintain appropriate tone for these sensitive topics
          return griefResponse;
        }
      }

      // Detect developmental stage for age-appropriate responses
      const developmentalStage = detectDevelopmentalStage(userInput);
      
      // HIGHEST PRIORITY: Check for introductions if this is the first interaction
      if (isIntroduction(userInput) && !introductionMade) {
        return generateIntroductionResponse();
      }
      
      // SECOND PRIORITY: Process any personal sharing with explicit feelings
      // This ensures we immediately acknowledge stated emotions before anything else
      if (isPersonalSharing(userInput)) {
        const personalResponse = generatePersonalSharingResponse(userInput);
        
        // Occasionally add Roger's perspective to personal sharing responses
        // Now more carefully controlled based on therapeutic relevance
        const perspectivePhrase = getRogerPerspectivePhrase(userInput);
        if (perspectivePhrase) {
          return personalResponse + perspectivePhrase;
        }
        return personalResponse;
      }
      
      // Check if we should use a conversation starter based on context
      if (shouldUseConversationStarter(messageCount, userInput) && developmentalStage) {
        const conversationStarter = generateConversationStarterResponse(developmentalStage);
        return `${adaptiveResponseFn(userInput)} ${conversationStarter}`;
      }
      
      // Implementation of the 10-minute rule for reflections - prioritize in early conversation
      if (messageCount <= EARLY_CONVERSATION_MESSAGE_THRESHOLD) {
        // First try a reflection response for early conversation (first 10 minutes/messages)
        const reflectionResponse = generateReflectionResponse(userInput, conversationStage, messageCount);
        if (reflectionResponse) {
          return reflectionResponse;
        }
        
        // If no reflection was generated, check for small talk
        if (isSmallTalk(userInput)) {
          return generateSmallTalkResponse(userInput);
        }
        else {
          // Use adaptive response as last resort in early conversation
          const response = adaptiveResponseFn(userInput);
          // Occasionally add Roger's perspective
          const perspectivePhrase = getRogerPerspectivePhrase(userInput);
          if (perspectivePhrase) {
            return response + perspectivePhrase;
          }
          return response;
        }
      }
      
      // For established conversations:
      
      // Check for small talk
      if (isSmallTalk(userInput)) {
        return generateSmallTalkResponse(userInput);
      }
      
      // Try a reflection response (but less frequently in established conversation)
      const reflectionResponse = generateReflectionResponse(userInput, conversationStage, messageCount);
      if (reflectionResponse) {
        return reflectionResponse;
      } else {
        // If no reflection was appropriate, generate an adaptive response
        const response = adaptiveResponseFn(userInput);
        // Occasionally add Roger's perspective
        const perspectivePhrase = getRogerPerspectivePhrase(userInput);
        if (perspectivePhrase) {
          return response + perspectivePhrase;
        }
        return response;
      }
    } catch (error) {
      console.error("Error in response generation:", error);
      return "I'm listening. Would you like to tell me more about that?";
    }
  };
  
  return {
    generateResponse
  };
};

export { useResponseGenerator };
