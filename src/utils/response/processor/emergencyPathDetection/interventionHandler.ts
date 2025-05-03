/**
 * Emergency Path Intervention Handler
 * 
 * Applies different intervention strategies for detected emergency paths
 */

import { EmergencyPathResult, SeverityLevel } from './types';
import { fixRepeatedContent, hasSharedThatPattern } from '../hallucinationHandler/specialCases';

/**
 * Apply appropriate intervention to fix a problematic response
 */
export const applyEmergencyIntervention = (
  responseText: string,
  emergencyPathResult: EmergencyPathResult,
  userInput: string
): string => {
  // First, fix any repetition issues which are the most critical
  let correctedResponse = fixRepeatedContent(responseText);
  
  // If the severity is SEVERE, we need to start fresh with a completely new response pattern
  if (emergencyPathResult.severity === SeverityLevel.SEVERE) {
    // Extract any key information from the user input
    const keyTerms = extractKeyTerms(userInput);
    
    // Generate an entirely new response that doesn't follow the problematic patterns
    return generateFreshResponse(keyTerms, userInput);
  }
  
  // For HIGH severity, we should replace the response structure but keep the essential content
  if (emergencyPathResult.severity === SeverityLevel.HIGH) {
    // Check if this has the problematic "shared that" pattern
    if (hasSharedThatPattern(correctedResponse)) {
      correctedResponse = replaceSharedThatPattern(correctedResponse, userInput);
    }
    
    // Fix any other high-risk patterns
    correctedResponse = replaceHighRiskPatterns(correctedResponse);
  }
  
  // For MEDIUM severity, make targeted fixes to the specific issues
  if (emergencyPathResult.severity === SeverityLevel.MEDIUM) {
    // Check for each flag type and apply specific fixes
    emergencyPathResult.flags.forEach(flag => {
      if (flag.type === 'false_continuity') {
        correctedResponse = replaceFalseContinuityReferences(correctedResponse);
      } else if (flag.type.includes('repetition')) {
        // Already fixed by fixRepeatedContent at the start
      }
    });
  }
  
  return correctedResponse;
};

/**
 * Extract key terms from user input for response generation
 */
const extractKeyTerms = (userInput: string): string[] => {
  // Simple extraction of potential topic words
  const lowercaseInput = userInput.toLowerCase();
  
  // Look for common emotional terms
  const emotions = ['happy', 'sad', 'angry', 'anxious', 'frustrated', 'confused', 
    'embarrassed', 'nervous', 'scared', 'excited', 'overwhelmed', 'tired'];
  
  const foundEmotions = emotions.filter(emotion => 
    lowercaseInput.includes(emotion)
  );
  
  // Look for potential topics
  const potentialTopics: string[] = [];
  
  // Social situations
  if (/friend|colleague|coworker|boss|partner|date|relationship|social/i.test(userInput)) {
    potentialTopics.push('social situation');
  }
  
  // Work-related
  if (/work|job|career|office|meeting|interview|project/i.test(userInput)) {
    potentialTopics.push('work');
  }
  
  // School-related
  if (/school|class|study|homework|exam|test|teacher|professor/i.test(userInput)) {
    potentialTopics.push('school');
  }
  
  // Family-related
  if (/family|parent|mom|dad|mother|father|sibling|brother|sister|child|kid/i.test(userInput)) {
    potentialTopics.push('family');
  }
  
  return [...foundEmotions, ...potentialTopics];
};

/**
 * Generate a completely fresh response that avoids problematic patterns
 */
const generateFreshResponse = (keyTerms: string[], userInput: string): string => {
  // If we identified emotions, acknowledge them
  if (keyTerms.includes('embarrassed') || keyTerms.includes('nervous')) {
    return "That sounds like an uncomfortable situation. Social moments like that can make us feel self-conscious. How did you feel afterwards?";
  }
  
  if (keyTerms.some(term => ['social situation', 'date', 'girl', 'bar'].some(keyword => term.includes(keyword) || userInput.toLowerCase().includes(keyword)))) {
    return "Social situations can sometimes create awkward moments that stick with us. What's on your mind about how it went?";
  }
  
  // Default engagement response
  return "I'm following what you're sharing. What aspect of this experience has been most on your mind?";
};

/**
 * Replace the "It seems like you shared that" pattern with more natural language
 */
const replaceSharedThatPattern = (responseText: string, userInput: string): string => {
  // Extract what they supposedly shared
  const match = responseText.match(/It seems like you shared that ([^.]+)\./i);
  
  if (match && match[1]) {
    const sharedContent = match[1];
    
    // Check if this content is actually in the user input
    if (userInput.toLowerCase().includes(sharedContent.toLowerCase())) {
      // It's actually accurate, just rephrase it
      return responseText.replace(
        /It seems like you shared that ([^.]+)\./i,
        `I understand you mentioned ${sharedContent}.`
      );
    } else {
      // It's not accurate, use a more general acknowledgment
      return responseText.replace(
        /It seems like you shared that ([^.]+)\./i,
        "Thanks for sharing that with me."
      );
    }
  }
  
  return responseText;
};

/**
 * Replace high risk patterns with safer alternatives
 */
const replaceHighRiskPatterns = (responseText: string): string => {
  let result = responseText;
  
  // Replace "you may have indicated"
  result = result.replace(
    /you may have indicated/gi,
    "you mentioned"
  );
  
  // Replace awkward "I hear you're feeling" repetitions
  result = result.replace(
    /(I hear|It sounds like) you('re| are) feeling .{3,30}(I hear|It sounds like) you('re| are) feeling/gi,
    "I hear you're feeling"
  );
  
  return result;
};

/**
 * Replace false continuity references
 */
const replaceFalseContinuityReferences = (responseText: string): string => {
  let result = responseText;
  
  // Replace false references to previous conversations
  result = result.replace(
    /we('ve| have) been (focusing|talking|discussing) on/gi,
    "you mentioned"
  );
  
  result = result.replace(
    /as we discussed earlier|as I mentioned earlier|we talked about this before/gi,
    "from what you've shared"
  );
  
  return result;
};
