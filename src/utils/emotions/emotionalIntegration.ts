
/**
 * Emotional Integration System
 * 
 * Central connection point that integrates the emotions wheel with all other systems
 * including memory, hallucination prevention, therapy approaches, etc.
 */

import { emotionsWheel, getEmotionFromWheel, detectSocialEmotionalContext } from './emotionsWheel';
import { 
  processEmotions, 
  extractEmotionsFromInput,
  createEmotionMemoryContext
} from '../response/processor/emotions';
import { calculateMinimumResponseTime } from '../masterRules';
import { 
  checkEmotionMisidentification,
  fixEmotionMisidentification,
  performFinalEmotionVerification,
  createEmotionContext
} from '../response/processor/emotionHandler/emotionMisidentificationHandler';

/**
 * Integrates emotions with memory systems
 * Call this before storing memories to ensure emotional context is preserved
 * ENHANCED with higher importance for depression and explicit emotions
 * 
 * @param userInput User's original message
 * @param responseText Roger's response to the input
 * @returns Enhanced memory object with emotional context
 */
export const integrateEmotionsWithMemory = (userInput: string, responseText: string) => {
  // Extract emotions from user input
  const emotions = extractEmotionsFromInput(userInput);
  
  // Determine memory importance - prioritize depression
  const isDepressionMentioned = emotions.isDepressionMentioned || 
    /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(userInput.toLowerCase());
  
  const memoryImportance = isDepressionMentioned ? 0.95 : // Critical - highest priority
                           emotions.hasDetectedEmotion ? 0.8 : // High importance for any emotion
                           0.5; // Medium importance for non-emotional content
  
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
      } : null,
      isDepressionMentioned,
      requiresAcknowledgment: emotions.hasDetectedEmotion || isDepressionMentioned
    },
    memoryImportance, // Add importance score for prioritization
    requiresConsistentEmotionalFollowup: emotions.hasDetectedEmotion || isDepressionMentioned,
    timestamp: new Date().toISOString()
  };
};

/**
 * Enhanced integration with hallucination prevention systems
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
  const emotionMisidentified = checkEmotionMisidentification(responseText, userInput);
  
  // Check specifically for depression misidentification
  const hasDepressionIndicators = emotions.isDepressionMentioned || 
    /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(userInput.toLowerCase());
  
  const depressionMisidentified = hasDepressionIndicators && 
    (!/\b(depress(ed|ing|ion)?|feeling down|difficult time|hard time|challenging|struggle)\b/i.test(responseText.toLowerCase()) ||
     /you'?re feeling (neutral|fine|good|okay|alright|well)/i.test(responseText));
  
  return {
    emotionMisidentified,
    depressionMisidentified,
    emotionDetectionConfidence: emotions.hasDetectedEmotion ? 0.9 : 0.6,
    detectedEmotions: emotions,
    riskLevel: depressionMisidentified ? 'critical' : 
               emotionMisidentified ? 'high' : 'low',
    recommendedFix: depressionMisidentified ? 
      `Acknowledge that the user is feeling depressed` : 
      (emotionMisidentified && emotions.explicitEmotion) ?
      `Acknowledge that the user is feeling ${emotions.explicitEmotion}` : null,
    priorityLevel: depressionMisidentified ? 1 : // Highest priority
                   emotionMisidentified ? 2 : 
                   3 // Normal priority
  };
};

/**
 * ENHANCED integration with therapeutic approaches (Rogerian and logotherapy)
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
  
  // Check for critical depression signals first - always prioritize Rogerian for depression
  const hasDepressionIndicators = emotions.isDepressionMentioned || 
    /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(userInput.toLowerCase());
  
  if (hasDepressionIndicators) {
    recommendedApproach = 'rogerian';
    logotherapyStrength = 2; // Very minimal logotherapy, focus on feelings first
    
    // Further customize based on whether meaning themes are present
    if (emotions.meaningThemes && emotions.meaningThemes.hasMeaningTheme) {
      // If depression + meaning themes, use a slightly blended approach
      logotherapyStrength = 3; // Still prioritize Rogerian (7/10) but add some meaning (3/10)
    }
    
    return {
      recommendedApproach,
      logotherapyStrength,
      rogerianStrength: 10 - logotherapyStrength,
      emotionalContext: emotions,
      requiresEmotionalAcknowledgment: true,
      criticalEmotionalState: true, // Flag for special handling
      therapeuticPriority: 'emotional_safety'
    };
  }
  
  // If not depression, process normally
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
    requiresEmotionalAcknowledgment: emotions.hasDetectedEmotion,
    criticalEmotionalState: false,
    therapeuticPriority: emotions.hasDetectedEmotion ? 'emotional_awareness' : 'meaning_exploration'
  };
};

/**
 * ENHANCED Master integration function that connects emotions across all systems
 * Now with better priority handling and emotion context preservation
 * 
 * @param userInput User's message
 * @param responseText Roger's response
 * @returns Fully integrated response object
 */
export const integrateEmotionsAcrossAllSystems = (
  userInput: string,
  responseText: string
) => {
  // Step 1: Extract emotions with special attention to depression
  const emotions = extractEmotionsFromInput(userInput);
  const hasDepressionIndicators = emotions.isDepressionMentioned || 
    /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(userInput.toLowerCase());
  
  // Create emotion context object for sharing across systems
  const emotionContext = {
    hasDetectedEmotion: emotions.hasDetectedEmotion || hasDepressionIndicators,
    primaryEmotion: hasDepressionIndicators ? 'depressed' : 
                   emotions.explicitEmotion || 
                   (emotions.emotionalContent.hasEmotion ? emotions.emotionalContent.primaryEmotion : null),
    emotionalIntensity: hasDepressionIndicators ? 'high' :
                       (emotions.emotionalContent.hasEmotion ? emotions.emotionalContent.intensity : null),
    isDepressionMentioned: hasDepressionIndicators,
    requiresAcknowledgment: emotions.hasDetectedEmotion || hasDepressionIndicators,
    priority: hasDepressionIndicators ? 'critical' : 
             emotions.hasDetectedEmotion ? 'high' : 'normal',
    timestamp: new Date().toISOString()
  };
  
  // Step 2: Process the response to fix any emotion misidentifications
  const processedResponse = processEmotions(responseText, userInput, emotionContext);
  
  // Step 3: Integrate with all systems
  const memoryIntegration = integrateEmotionsWithMemory(userInput, processedResponse);
  const hallucinationIntegration = integrateEmotionsWithHallucinationPrevention(processedResponse, userInput);
  const therapeuticIntegration = integrateEmotionsWithTherapeuticApproaches(userInput);
  
  // Step 4: Perform final verification
  const finalResponse = performFinalEmotionVerification(processedResponse, userInput, emotionContext);
  
  // Step 5: Calculate appropriate response time with emotional context
  let responseTimeComplexity = 4; // Medium complexity by default
  if (userInput.length > 80) responseTimeComplexity = 6;
  if (userInput.length > 150) responseTimeComplexity = 8;
  
  const emotionalWeight = emotions.hasDetectedEmotion ? 
    (emotions.emotionalContent.intensity === 'high' ? 8 : 
     emotions.emotionalContent.intensity === 'medium' ? 5 : 3) : 2;
  
  // Give extra time for depression
  const depressionBonus = hasDepressionIndicators ? 2 : 0;
  
  const responseTime = calculateMinimumResponseTime(
    responseTimeComplexity, 
    emotionalWeight + depressionBonus
  );
  
  // Return the complete integration object
  return {
    emotions,
    emotionContext,
    processedResponse: finalResponse,
    memoryIntegration,
    hallucinationIntegration,
    therapeuticIntegration,
    responseTime,
    shouldUseEmotionAcknowledgment: emotions.hasDetectedEmotion || hasDepressionIndicators,
    requiredAcknowledgment: hasDepressionIndicators ? 'depressed' : 
                          (emotions.explicitEmotion || 
                           (emotions.emotionalContent.hasEmotion ? emotions.emotionalContent.primaryEmotion : null)),
    priorityLevel: hasDepressionIndicators ? 'critical' : 
                   emotions.hasDetectedEmotion ? 'high' : 'normal'
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

/**
 * Creates a lookback mechanism to check recent emotional states
 * @param recentUserInputs Array of recent user messages
 * @returns Analysis of emotional state over time
 */
export const createEmotionalLookback = (recentUserInputs: string[]) => {
  if (!recentUserInputs || recentUserInputs.length === 0) {
    return { hasConsistentPattern: false };
  }
  
  // Process emotions for each message
  const emotionTracking = recentUserInputs.map(input => {
    const emotions = extractEmotionsFromInput(input);
    const hasDepressionIndicators = emotions.isDepressionMentioned || 
      /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(input.toLowerCase());
    
    return {
      hasEmotion: emotions.hasDetectedEmotion,
      primaryEmotion: hasDepressionIndicators ? 'depressed' : 
                     emotions.explicitEmotion || 
                     (emotions.emotionalContent.hasEmotion ? emotions.emotionalContent.primaryEmotion : null),
      isDepressionMentioned: hasDepressionIndicators
    };
  });
  
  // Check for consistent emotional patterns
  const depressionCount = emotionTracking.filter(entry => entry.isDepressionMentioned).length;
  const hasConsistentDepression = depressionCount >= 2; // Two or more mentions of depression
  
  // Count emotions to find most common
  const emotionCounts: Record<string, number> = {};
  emotionTracking.forEach(entry => {
    if (entry.primaryEmotion) {
      emotionCounts[entry.primaryEmotion] = (emotionCounts[entry.primaryEmotion] || 0) + 1;
    }
  });
  
  // Find the most common emotion
  let mostCommonEmotion = null;
  let highestCount = 0;
  
  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    if (count > highestCount) {
      mostCommonEmotion = emotion;
      highestCount = count;
    }
  });
  
  return {
    hasConsistentPattern: hasConsistentDepression || highestCount >= 2,
    mostCommonEmotion,
    hasConsistentDepression,
    emotionTracking,
    requiresPrioritization: hasConsistentDepression
  };
};
