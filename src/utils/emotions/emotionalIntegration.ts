
/**
 * Emotional Integration System
 * 
 * Central connection point that integrates the emotions wheel with all other systems
 * including memory, hallucination prevention, therapy approaches, etc.
 */

import { emotionsWheel, getEmotionFromWheel, detectSocialEmotionalContext } from './emotionsWheel';
import { processEmotions, extractEmotionsFromInput } from '../response/processor/emotions';
import { calculateMinimumResponseTime } from '../masterRules';

/**
 * Integrates emotions with memory systems
 * Call this before storing memories to ensure emotional context is preserved
 * 
 * @param userInput User's original message
 * @param responseText Roger's response to the input
 * @returns Enhanced memory object with emotional context
 */
export const integrateEmotionsWithMemory = (userInput: string, responseText: string) => {
  // Extract emotions from user input
  const emotions = extractEmotionsFromInput(userInput);
  
  // Create the memory object with emotional context
  return {
    userMessage: userInput,
    rogerResponse: responseText,
    emotionalContext: {
      explicitEmotion: emotions.explicitEmotion,
      hasDetectedEmotion: emotions.hasDetectedEmotion,
      emotionalContentType: emotions.emotionalContent.hasEmotion ? 
        emotions.emotionalContent.primaryEmotion : null,
      emotionalIntensity: emotions.emotionalContent.hasEmotion ?
        emotions.emotionalContent.intensity : null,
      socialContext: emotions.socialContext ? {
        type: emotions.socialContext.primaryEmotion,
        intensity: emotions.socialContext.intensity,
        description: emotions.socialContext.description
      } : null
    },
    timestamp: new Date().toISOString()
  };
};

/**
 * Integrates emotions with hallucination prevention systems
 * Ensures that emotional misidentifications don't turn into hallucinations
 * 
 * @param responseText Response to check
 * @param userInput Original input to compare against
 * @returns Object containing hallucination risk analysis
 */
export const integrateEmotionsWithHallucinationPrevention = (responseText: string, userInput: string) => {
  // Extract emotions from user input
  const emotions = extractEmotionsFromInput(userInput);
  
  // Check for emotion misidentification in the response
  const claimsNeutral = /you('re| are) feeling neutral|feeling neutral|hear you're feeling neutral/i.test(responseText);
  
  // If response claims neutral but we detected emotion, this is a potential hallucination
  const potentialHallucination = claimsNeutral && emotions.hasDetectedEmotion;
  
  return {
    potentialHallucination,
    emotionMismatch: potentialHallucination,
    detectedEmotions: emotions,
    riskLevel: potentialHallucination ? 'high' : 'low',
    recommendedFix: potentialHallucination ? 
      `Acknowledge that the user is feeling ${emotions.explicitEmotion || emotions.emotionalContent.primaryEmotion}` : null
  };
};

/**
 * Integrates emotions with therapeutic approaches (Rogerian and logotherapy)
 * 
 * @param userInput User's original message
 * @returns Object with recommended therapeutic approaches based on emotional content
 */
export const integrateEmotionsWithTherapeuticApproaches = (userInput: string) => {
  // Extract emotions from user input
  const emotions = extractEmotionsFromInput(userInput);
  
  // Determine appropriate therapy style based on emotions
  let recommendedApproach = 'rogerian'; // Default to Rogerian
  let logotherapyStrength = 0; // 0-10 scale
  
  // If existential themes are present, lean toward logotherapy
  const existentialPatterns = /meaning|purpose|point|empty|life|death|existence|why/i;
  if (existentialPatterns.test(userInput)) {
    recommendedApproach = 'logotherapy';
    logotherapyStrength = 7;
    
    // If also emotionally charged, blend approaches
    if (emotions.hasDetectedEmotion) {
      recommendedApproach = 'blended';
      logotherapyStrength = 5;
    }
  }
  
  // For high emotional intensity, prioritize Rogerian
  if (emotions.emotionalContent.hasEmotion && 
      emotions.emotionalContent.intensity === 'high') {
    recommendedApproach = 'rogerian';
    logotherapyStrength = Math.max(0, logotherapyStrength - 3);
  }
  
  return {
    recommendedApproach,
    logotherapyStrength,
    rogerianStrength: 10 - logotherapyStrength,
    emotionalContext: emotions,
    requiresEmotionalAcknowledgment: emotions.hasDetectedEmotion
  };
};

/**
 * Integrates emotions with grammar correction
 * Ensures that emotional acknowledgments aren't grammatically modified
 * 
 * @param responseText Response to check for grammar
 * @param userInput Original user input for context
 * @returns Safe-to-modify sections of the response
 */
export const integrateEmotionsWithGrammar = (responseText: string, userInput: string) => {
  // Find emotional acknowledgment phrases that should be preserved
  const acknowledgmentPatterns = [
    /I hear that you're feeling \w+/i,
    /It sounds like you're feeling \w+/i,
    /I can tell this is making you feel \w+/i,
    /That must be \w+ for you/i
  ];
  
  // Check if response contains acknowledgments
  const acknowledgments = acknowledgmentPatterns
    .map(pattern => responseText.match(pattern))
    .filter(Boolean)
    .map(match => match?.[0] || '');
  
  return {
    hasAcknowledgments: acknowledgments.length > 0,
    acknowledgments,
    safeToModify: acknowledgments.reduce((text, ack) => 
      text.replace(ack, '{{PRESERVE}}' + ack + '{{/PRESERVE}}'), 
      responseText
    )
  };
};

/**
 * Master integration function that connects emotions across all systems
 * 
 * @param userInput User's message
 * @param responseText Roger's response
 * @returns Fully integrated response object
 */
export const integrateEmotionsAcrossAllSystems = (
  userInput: string,
  responseText: string
) => {
  // Step 1: Extract emotions
  const emotions = extractEmotionsFromInput(userInput);
  
  // Step 2: Process the response to fix any emotion misidentifications
  const processedResponse = processEmotions(responseText, userInput);
  
  // Step 3: Integrate with all systems
  const memoryIntegration = integrateEmotionsWithMemory(userInput, processedResponse);
  const hallucinationIntegration = integrateEmotionsWithHallucinationPrevention(processedResponse, userInput);
  const therapeuticIntegration = integrateEmotionsWithTherapeuticApproaches(userInput);
  const grammarIntegration = integrateEmotionsWithGrammar(processedResponse, userInput);
  
  // Step 4: Calculate appropriate response time
  let responseTimeComplexity = 4; // Medium complexity by default
  if (userInput.length > 100) responseTimeComplexity = 6;
  if (userInput.length > 200) responseTimeComplexity = 8;
  
  const emotionalWeight = emotions.hasDetectedEmotion ? 
    (emotions.emotionalContent.intensity === 'high' ? 8 : 
     emotions.emotionalContent.intensity === 'medium' ? 5 : 3) : 2;
  
  const responseTime = calculateMinimumResponseTime(responseTimeComplexity, emotionalWeight);
  
  // Return the complete integration object
  return {
    emotions,
    processedResponse,
    memoryIntegration,
    hallucinationIntegration,
    therapeuticIntegration,
    grammarIntegration,
    responseTime,
    shouldUseEmotionAcknowledgment: emotions.hasDetectedEmotion,
    requiredAcknowledgment: emotions.explicitEmotion || 
      (emotions.emotionalContent.hasEmotion ? emotions.emotionalContent.primaryEmotion : null)
  };
};

/**
 * Helper function to get feeling description from the emotions wheel
 * Useful for generating empathetic responses
 */
export const getEmotionDescription = (emotion: string): string => {
  const entry = getEmotionFromWheel(emotion);
  if (!entry) return '';
  
  // Return description or generate one based on emotion properties
  return entry.description || 
    `Feeling ${entry.intensity === 'high' ? 'strongly ' : ''}${entry.name}`;
};
