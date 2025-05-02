
import { detectDefensiveReaction } from '../../utils/safetySupport';
import { generateDeescalationResponse } from '../../utils/responseUtils';
import { TraumaResponseAnalysis } from '../reflection/reflectionTypes';
import { distinguishSadnessFromDepression } from '../../utils/detectionUtils';
import { identifyEnhancedFeelings } from '../reflection/feelingDetection';

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

/**
 * Creates a response for weather-related situations like extreme snow, storms, etc.
 * @param userInput The user's message about weather challenges
 * @returns A reflective response that acknowledges the user's situation
 */
export const createWeatherRelatedResponse = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Extract keywords related to specific weather conditions
  const hasSnow = /snow|blizzard|ice storm|winter/i.test(lowerInput);
  const hasFlood = /flood|rain|water|hurricane/i.test(lowerInput);
  const hasHeat = /heat wave|heat|hot|temperature|humid/i.test(lowerInput);
  const hasStorm = /storm|tornado|hurricane|typhoon|wind|thunderstorm/i.test(lowerInput);
  const hasPower = /power|electricity|outage|internet|connection|service/i.test(lowerInput);
  
  // Match specific weather challenges
  if (hasSnow) {
    return `Being stuck indoors during heavy snow can be really challenging. It's natural to feel a bit stir-crazy when you can't go about your normal routine. How have you been managing to pass the time while you're confined to your home?`;
  } else if (hasFlood) {
    return `Flooding situations can be both frustrating and concerning. It's completely understandable to feel anxious when your mobility and normal routines are disrupted by water. How are you managing to take care of yourself during this difficult time?`;
  } else if (hasHeat) {
    return `Extreme heat can be physically and emotionally draining, especially when it lasts for multiple days. It's natural to feel irritable or low energy when dealing with high temperatures. What strategies have you found to stay comfortable?`;
  } else if (hasStorm) {
    return `Storm situations can create a lot of uncertainty and disruption to daily life. The combination of possible danger and practical challenges often leads to feelings of stress or anxiety. How are you coping with the situation right now?`;
  } else if (hasPower) {
    return `Power outages can be incredibly frustrating, especially when they affect your ability to work, communicate, or enjoy basic comforts. It's natural to feel disconnected and isolated when technology we rely on isn't available. How are you managing to adapt to these temporary limitations?`;
  }
  
  // Default response for general weather challenges
  return `Weather emergencies can be really disruptive to our routines and wellbeing. It's completely normal to feel frustrated, isolated, or down when your normal activities are limited by circumstances beyond your control. How have you been coping with these restrictions?`;
};

/**
 * Creates a trauma-informed response for users showing trauma response patterns
 * but not at clinical PTSD levels
 */
export const createTraumaResponseMessage = (userInput: string): string | null => {
  try {
    // Import the module synchronously
    const traumaModule = require('../../utils/response/traumaResponsePatterns');
    
    const analysis = traumaModule.detectTraumaResponsePatterns(userInput);
    
    // If we have a valid analysis, generate a trauma-informed response
    if (analysis && analysis.dominant4F) {
      return traumaModule.generateTraumaInformedResponse(analysis);
    }
    return null;
  } catch (e) {
    console.log("Error in trauma response generation:", e);
    return null;
  }
};

/**
 * Creates a response for sadness that is appropriately tailored to whether it's normal sadness
 * or clinical depression based on content analysis
 */
export const createSadnessResponse = (userInput: string): string | null => {
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
 * Creates a response for mild gambling concerns that emphasizes reflection rather than crisis response
 * @param userInput The user's message about gambling
 * @returns A reflective response that acknowledges the user's feelings without escalation
 */
export const createMildGamblingResponse = (userInput: string): string => {
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
