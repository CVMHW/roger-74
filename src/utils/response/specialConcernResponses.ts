
import { ConcernType } from '../reflection/reflectionTypes';
import { extractConversationContext } from '../conversationEnhancement/repetitionDetector';

/**
 * Generates a response for weather-related situations like extreme snow, storms, etc.
 */
export const generateWeatherRelatedResponse = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  const context = extractConversationContext(userInput, []);
  
  // Check for specific weather-related themes
  const hasSnow = /\b(snow|blizzard|storm|hurricane|tornado|flood|ice|weather|power outage|electricity)\b/i.test(lowerInput);
  const hasPowerIssues = /\b(power outage|electricity|power|no heat|cold|freezing|internet down)\b/i.test(lowerInput);
  const hasIsolation = /\b(stuck|trapped|can'?t leave|unable to leave|days|inside|home|house|isolated|cabin fever|bored)\b/i.test(lowerInput);
  const hasFrustration = /\b(frustrat|annoy|bore|tired of|sick of|fed up|can'?t stand|stir-crazy)\b/i.test(lowerInput);
  const hasWork = /\b(work|job|remote|working from home|can'?t work)\b/i.test(lowerInput);
  const hasPet = /\b(dog|cat|pet|walk|doggie|kitty|puppy|kitten|animal)\b/i.test(lowerInput);
  
  let response = "I hear you're dealing with challenging weather that's really affecting your daily life. ";
  
  // Add specific acknowledgments based on mentioned challenges
  if (context.locations.length > 0) {
    response += `Being stuck at home in ${context.locations[0]} during severe weather can definitely be difficult. `;
  }
  
  if (hasSnow) {
    response += "Four feet of snow is extreme - most cities aren't equipped to handle that much accumulation quickly. ";
  }
  
  if (hasPowerIssues) {
    response += "The rolling power and internet outages must be making this situation even more challenging, especially when you're trying to maintain some normalcy. ";
  }
  
  if (hasIsolation && hasWork) {
    response += "Being unable to leave home while also struggling to work remotely due to infrastructure issues creates a frustrating double bind. ";
  } else if (hasIsolation) {
    response += "Being confined indoors for days can really take a toll on your mood and energy. ";
  }
  
  if (hasPet) {
    response += "It must be tough for both you and your pet to be cooped up, especially when your dog needs exercise and outdoor time. ";
  }
  
  if (hasFrustration) {
    response += "Your frustration is completely understandable given these circumstances. ";
  }
  
  // Add a thoughtful question to continue the conversation
  const followUpQuestions = [
    "How have you been coping with the isolation so far?",
    "Have you found any activities that help pass the time when the power is working?",
    "What's been the most challenging part of this weather situation for you?",
    "How have you been taking care of your wellbeing during this difficult time?",
    "Is there anything that's been helping you get through these difficult days?"
  ];
  
  response += followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
  
  return response;
};

/**
 * Generates a response for cultural adjustment concerns
 */
export const generateCulturalAdjustmentResponse = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  const context = extractConversationContext(userInput, []);
  
  // Check for specific cultural adjustment themes
  const hasLanguageBarrier = /\b(language|speak|arabic|urdu|hindi|english)\b/i.test(lowerInput);
  const hasWeatherAdjustment = /\b(cold|weather|temperature|climate|winter|snow)\b/i.test(lowerInput);
  const hasFoodChallenges = /\b(food|eat|cuisine|meal|restaurant|cooking)\b/i.test(lowerInput);
  const hasSocialIsolation = /\b(alone|lonely|isolated|don'?t know anyone|no friends|miss|homesick)\b/i.test(lowerInput);
  const hasReligiousIdentity = /\b(muslim|islam|religion|faith|prayer|mosque|church|temple)\b/i.test(lowerInput);
  
  let response = "Moving to a new country involves so many adjustments all at once. ";
  
  // Add specific acknowledgments based on mentioned challenges
  if (context.locations.length > 0) {
    const fromLocation = context.locations.find(loc => loc.toLowerCase() !== "cleveland");
    if (fromLocation) {
      response += `The transition from ${fromLocation} to Cleveland brings its own unique challenges. `;
    }
  }
  
  if (hasLanguageBarrier) {
    response += "Language barriers can be especially isolating when you're trying to build a new life. ";
  }
  
  if (hasWeatherAdjustment) {
    response += "Adapting to Cleveland's cold climate can be physically and emotionally draining, especially if you're from a warmer region. ";
  }
  
  if (hasFoodChallenges) {
    response += "Food is deeply connected to our sense of home and comfort. Finding familiar foods or adapting to new cuisines is a significant adjustment. ";
  }
  
  if (hasReligiousIdentity) {
    response += "Practicing your faith in a new cultural context can present its own set of challenges and opportunities. ";
  }
  
  if (hasSocialIsolation) {
    response += "The feeling of disconnection when you don't have your community around you is one of the hardest parts of relocation. ";
  }
  
  // Add a thoughtful question to continue the conversation
  const followUpQuestions = [
    "What has been the most difficult adjustment for you so far?",
    "Have you found any resources or communities that have helped with this transition?",
    "What aspects of your home do you miss the most right now?",
    "How have you been taking care of yourself through these changes?",
    "Have there been any unexpected positive discoveries in your new environment?"
  ];
  
  response += followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
  
  return response;
};

/**
 * Creates a response for mild gambling concerns that emphasizes reflection rather than crisis response
 */
export const createMildGamblingResponse = (userInput: string): string => {
  // Extract keywords related to sports teams and events if present
  const lowerInput = userInput.toLowerCase();
  
  // Import sports teams data if available
  let sportTeamsModule;
  try {
    // Dynamic import to avoid circular dependencies
    sportTeamsModule = require('../reflection/sportsTeamsData');
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
 * Creates a trauma-informed response for users showing trauma response patterns
 * but not at clinical PTSD levels
 */
export const createTraumaResponseMessage = (userInput: string): string | null => {
  try {
    // Import the module synchronously instead of asynchronously
    const traumaModule = require('./traumaResponsePatterns');
    
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
  const { distinguishSadnessFromDepression } = require('../detectionUtils');
  const { identifyEnhancedFeelings } = require('../reflection/feelingDetection');
  
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
 * Applies tailored response based on the specific concern type
 */
export const generateSafetyConcernResponse = (
  userInput: string,
  concernType: ConcernType,
  clientPreferences: any
): string => {
  const safetyManager = require('../safetyConcernManager');
  return safetyManager.generateSafetyConcernResponse(userInput, concernType, clientPreferences);
};
