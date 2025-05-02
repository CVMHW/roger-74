
import { contextAwareReflections } from '../data/contextAwareReflections';
import { identifyEnhancedFeelings } from '../feelingDetection';
import { handleMinimalResponses } from './minimalResponseHandler';

/**
 * Generate a context-aware reflection based on user input
 */
export const generateContextAwareReflection = (input: string): string | null => {
  const lowerInput = input.toLowerCase();
  
  // First, check for specific everyday concerns that need immediate acknowledgment
  const everydayConcerns = detectEverydayConcerns(input);
  if (everydayConcerns) {
    return everydayConcerns;
  }
  
  // Next, identify enhanced feelings with more sensitivity
  const enhancedFeelings = identifyEnhancedFeelings(input);
  
  // If no specific feelings are detected, check for minimal responses (tiredness, etc.)
  if (enhancedFeelings.length === 0) {
    const minimalResponse = handleMinimalResponses(input);
    if (minimalResponse) {
      return minimalResponse;
    }
  }
  
  // For each detected feeling, find a matching reflection
  for (const feelingData of enhancedFeelings) {
    const { detectedWord, category } = feelingData;
    
    // Find reflections that match the detected feeling
    const matchingReflections = contextAwareReflections.filter(reflection =>
      reflection.trigger.some(triggerWord => lowerInput.includes(triggerWord))
    );
    
    // If no matching reflections are found, continue to the next feeling
    if (matchingReflections.length === 0) {
      continue;
    }
    
    // Select a random reflection from the matching reflections
    const selectedReflection = matchingReflections[Math.floor(Math.random() * matchingReflections.length)];
    
    // Select a random response from the selected reflection
    const selectedResponse = selectedReflection.response[Math.floor(Math.random() * selectedReflection.response.length)];
    
    return selectedResponse;
  }
  
  // Finally, check for any everyday situations or common problems
  const everydaySituations = detectEverydaySituations(input);
  if (everydaySituations) {
    return everydaySituations;
  }
  
  // If no matching reflections are found for any feelings, return null
  return null;
};

/**
 * Detect everyday concerns that need immediate acknowledgment
 */
const detectEverydayConcerns = (input: string): string | null => {
  // Detect spilled drink or similar accidents
  if (/spill(ed)?|drink|coffee|beverage|accident|mess/i.test(input)) {
    if (/guilt(y)?|embarrass(ed|ing)|ashamed|upset|bad about/i.test(input)) {
      return "I hear that you're feeling guilty about spilling your drink. Those small accidents can feel surprisingly upsetting, especially when they impact others. Would you like to talk more about what happened?";
    }
    return "Spilling something can be frustrating, especially when it affects others. I understand why that might be bothering you. How did the other person react?";
  }
  
  // Detect work-related frustrations
  if (/work|job|boss|coworker|meeting|presentation|deadline|project/i.test(input) && 
      /bad day|rough|tough|difficult|hard|stress|frustrat|upset|angry/i.test(input)) {
    return "Work situations can definitely be challenging. I hear that you've had a rough time at work today. What specifically happened that made it difficult?";
  }
  
  // Detect lost items
  if (/lost|can't find|missing|misplaced|looking for/i.test(input) && 
      /item|thing|stuff|wallet|keys|phone|wrench|tool/i.test(input)) {
    return "Losing something important can be really frustrating. I understand why you're upset about your missing item. How long have you been looking for it?";
  }
  
  return null;
};

/**
 * Detect everyday situations that might need acknowledgment
 */
const detectEverydaySituations = (input: string): string | null => {
  // Bad day at work
  if (/bad day|rough day|terrible day|awful day/i.test(input) && /work|job|office/i.test(input)) {
    return "Having a rough day at work can really affect your overall mood. What happened today that made it particularly difficult?";
  }
  
  // General bad day
  if (/bad day|rough day|terrible day|awful day/i.test(input)) {
    return "I'm sorry to hear you're having a bad day. Sometimes days just don't go as planned. What's been the most challenging part of your day so far?";
  }
  
  // Family disagreement
  if (/family|parent|sibling|brother|sister|mom|dad|mother|father/i.test(input) && 
      /argument|fight|disagree|conflict|tension|upset/i.test(input)) {
    return "Family disagreements can be really tough to navigate. I understand why that would be on your mind. Would it help to talk about what happened?";
  }
  
  return null;
};
