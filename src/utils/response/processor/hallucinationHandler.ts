
/**
 * Hallucination Handler
 * 
 * Detects and corrects potential hallucinations in Roger's responses
 */

import { detectHallucinations } from '../../memory/hallucination/detectorV2';

/**
 * Checks and corrects potential hallucinations in a response
 */
export const handlePotentialHallucinations = (
  response: string,
  userInput: string,
  conversationHistory: string[] = []
): {
  processedResponse: string;
  hallucinationData: {
    wasDetected: boolean;
    confidence: number;
    reason?: string;
  }
} => {
  try {
    // Check if this is an everyday social situation
    const isEverydaySituation = /trip(ped)?|spill(ed)?|embarrass(ing|ed)|awkward|class|teacher|student|bar|drink|party|date/i.test(userInput);
    
    // For everyday situations, apply conversational enhancements instead of hallucination checks
    if (isEverydaySituation) {
      console.log("EVERYDAY SITUATION: Applying conversational enhancements");
      
      const enhancedResponse = makeMoreConversational(response, userInput);
      
      return {
        processedResponse: enhancedResponse,
        hallucinationData: {
          wasDetected: false,
          confidence: 0
        }
      };
    }
    
    // Standard hallucination check for non-everyday situations
    const hallucinationCheck = detectHallucinations(response, userInput, conversationHistory);
    
    // If hallucination detected, modify the response
    if (hallucinationCheck.isHallucination) {
      console.log(`HALLUCINATION DETECTED: ${hallucinationCheck.reason}`);
      
      // Apply fix based on hallucination type
      const corrected = fixHallucination(response, hallucinationCheck);
      
      return {
        processedResponse: corrected,
        hallucinationData: {
          wasDetected: true,
          confidence: hallucinationCheck.confidence,
          reason: hallucinationCheck.reason
        }
      };
    }
    
    // No hallucination detected, return original
    return {
      processedResponse: response,
      hallucinationData: {
        wasDetected: false,
        confidence: 0,
      }
    };
    
  } catch (error) {
    console.error("Error in hallucination handler:", error);
    
    // Return original in case of error
    return {
      processedResponse: response,
      hallucinationData: {
        wasDetected: false,
        confidence: 0,
      }
    };
  }
};

/**
 * Make response more conversational for everyday situations
 */
const makeMoreConversational = (response: string, userInput: string): string => {
  // First, check if the response is already simple and conversational
  if (response.split(" ").length < 15 && !/(value|purpose|deeper|meaning|connection to)/i.test(response)) {
    return response;
  }
  
  // Check what happened in the user's message
  if (/trip(ped)?/i.test(userInput)) {
    return "That sounds pretty embarrassing. Most people have had moments like that in front of others. How did the class react?";
  }
  
  if (/spill(ed)?/i.test(userInput)) {
    return "Spilling something can definitely feel awkward in the moment. What happened next?";
  }
  
  if (/teacher/i.test(userInput)) {
    return "That's an awkward moment as a teacher. I can imagine you'd feel embarrassed in front of your students. How did they respond?";
  }
  
  if (/class/i.test(userInput)) {
    return "Embarrassing moments in class can feel magnified. Those moments usually pass much more quickly than they feel. How did you handle it?";
  }
  
  // Default conversational response for social situations
  return "That sounds like an awkward moment. Those kinds of situations often feel worse to us than they appear to others. How did you feel afterward?";
};

/**
 * Fix hallucinations based on detection result
 */
const fixHallucination = (
  response: string,
  hallucinationCheck: { 
    isHallucination: boolean; 
    confidence: number; 
    reason?: string 
  }
): string => {
  // Different strategies based on hallucination type
  if (hallucinationCheck.reason?.includes('memory reference')) {
    return fixMemoryReference(response);
  }
  
  if (hallucinationCheck.reason?.includes('repeated phrase')) {
    return fixRepeatedPhrases(response);
  }
  
  if (hallucinationCheck.reason?.includes('continuity')) {
    return fixContinuityClaim(response);
  }
  
  // Default fix for any other hallucination type
  return fixGeneralHallucination(response);
};

/**
 * Fix false memory references
 */
const fixMemoryReference = (response: string): string => {
  return response
    .replace(/you (mentioned|said|told me|indicated)/gi, "you're saying")
    .replace(/you've been (feeling|experiencing|dealing with)/gi, "you're")
    .replace(/as you (mentioned|said|noted|pointed out)/gi, "from what you're sharing")
    .replace(/earlier you (mentioned|said|talked about)/gi, "you just shared that")
    .replace(/I remember/gi, "I understand")
    .replace(/we (discussed|talked about)/gi, "you mentioned");
};

/**
 * Fix repeated phrases
 */
const fixRepeatedPhrases = (response: string): string => {
  // Split into sentences
  const sentences = response.split(/(?<=[.!?])\s+/);
  
  // Find unique sentences (remove duplicates)
  const uniqueSentences = Array.from(new Set(sentences));
  
  // Join back and return
  return uniqueSentences.join(' ');
};

/**
 * Fix false continuity claims
 */
const fixContinuityClaim = (response: string): string => {
  return response
    .replace(/as we've been discussing/gi, "based on what you're sharing")
    .replace(/our previous conversation/gi, "what you've shared")
    .replace(/we've been focusing on/gi, "regarding")
    .replace(/as I mentioned (earlier|before|previously)/gi, "")
    .replace(/continuing (from|with) (where we left off|our previous)/gi, "focusing on");
};

/**
 * Fix general hallucination
 */
const fixGeneralHallucination = (response: string): string => {
  return "Based on what you're sharing, " + response;
};
