
import { contextAwareReflections } from '../data/contextAwareReflections';
import { identifyEnhancedFeelings } from '../feelingDetection';
import { handleMinimalResponses } from './minimalResponseHandler';

/**
 * Generate a context-aware reflection based on user input
 */
export const generateContextAwareReflection = (input: string): string | null => {
  const lowerInput = input.toLowerCase();
  
  // HIGHEST PRIORITY: Check for everyday concerns that need immediate acknowledgment
  // This addresses the core issue of Roger not immediately recognizing concerns
  const everydayConcerns = detectEverydayConcerns(input);
  if (everydayConcerns) {
    return everydayConcerns;
  }
  
  // Enhanced feeling detection with improved sensitivity
  const enhancedFeelings = identifyEnhancedFeelings(input);
  
  // If no specific feelings are detected, check for minimal responses
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
  
  // Check for any everyday situations or common problems
  const everydaySituations = detectEverydaySituations(input);
  if (everydaySituations) {
    return everydaySituations;
  }
  
  // If no matching reflections are found for any feelings, return null
  return null;
};

/**
 * Detect everyday concerns that need immediate acknowledgment
 * Enhanced to better catch specific scenarios like spilled drinks with associated emotions
 */
const detectEverydayConcerns = (input: string): string | null => {
  const lowerInput = input.toLowerCase();
  
  // CRITICAL: Improved detection for spilled drinks/accidents with emotional content
  if (/spill(ed)?|drink|coffee|beverage|accident|mess/i.test(lowerInput)) {
    // Enhanced emotional detection - check for guilt feelings specifically
    if (/guilt(y)?|embarrass(ed|ing)|ashamed|upset|bad about|feel(ing)? (bad|terrible|awful)/i.test(lowerInput)) {
      return "I hear that you're feeling guilty about spilling your drink. Those small accidents can feel surprisingly upsetting, especially when they impact others. Would you like to talk more about what happened?";
    }
    
    // General spill without explicit guilt mention
    return "Spilling something can be frustrating, especially when it affects others. I understand why that might be bothering you. How did the other person react?";
  }
  
  // Detect work-related frustrations - higher precision matching
  if (/work|job|boss|coworker|meeting|presentation|deadline|project/i.test(lowerInput) && 
      /bad day|rough day|tough|difficult|hard|stress|frustrat|upset|angry/i.test(lowerInput)) {
    return "Work situations can definitely be challenging. I hear that you've had a rough time at work today. What specifically happened that made it difficult?";
  }
  
  // Detect lost items with enhanced sensitivity
  if (/lost|can't find|missing|misplaced|looking for/i.test(lowerInput) && 
      /item|thing|stuff|wallet|keys|phone|wrench|tool/i.test(lowerInput)) {
    return "Losing something important can be really frustrating. I understand why you're upset about your missing item. How long have you been looking for it?";
  }
  
  // Detect general bad day expressions with more nuance
  if (/bad day|rough day|terrible day|awful day|having a (bad|rough|terrible) day/i.test(lowerInput)) {
    return "I'm sorry to hear you're having a bad day. Sometimes days just don't go as planned. What's been the most challenging part of your day so far?";
  }
  
  return null;
};

/**
 * Detect everyday situations that might need acknowledgment
 * Enhanced with more precise pattern matching and response generation
 */
const detectEverydaySituations = (input: string): string | null => {
  const lowerInput = input.toLowerCase();
  
  // Bad day at work - more specific pattern matching
  if (/bad day|rough day|terrible day|awful day/i.test(lowerInput) && /work|job|office/i.test(lowerInput)) {
    return "Having a rough day at work can really affect your overall mood. What happened today that made it particularly difficult?";
  }
  
  // General bad day - already handled in detectEverydayConcerns for priority
  
  // Family disagreement with enhanced pattern matching
  if (/family|parent|sibling|brother|sister|mom|dad|mother|father/i.test(lowerInput) && 
      /argument|fight|disagree|conflict|tension|upset/i.test(lowerInput)) {
    return "Family disagreements can be really tough to navigate. I understand why that would be on your mind. Would it help to talk about what happened?";
  }
  
  // Enhanced wait time frustration detection
  if (/wait(ing)?|appointment|late|doctor|how long/i.test(lowerInput) && 
      /frustrat|annoyed|upset|tired of|bored/i.test(lowerInput)) {
    return "I understand waiting can be frustrating. Dr. Eric tries to give each person their needed time, which sometimes means short delays. Can I help make the wait more comfortable by chatting about what's on your mind?";
  }
  
  return null;
};
