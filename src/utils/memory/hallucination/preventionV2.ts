
/**
 * Hallucination Prevention System V2
 * 
 * Advanced system for preventing hallucinations in Roger's responses,
 * especially during the critical first 30 seconds to 5 minutes of interaction
 */

import { isEarlyConversation, detectRiskyEarlyStatements, fixRiskyEarlyStatements } from '../systems/earlyConversationHandler';
import { detectHallucinations } from './detectorV2';
import { MemorySystemConfig } from '../types';
import { DEFAULT_MEMORY_CONFIG } from '../config';

/**
 * Apply hallucination prevention to a response
 */
export const preventHallucinations = (
  responseText: string,
  userInput: string,
  conversationHistory: string[],
  config: MemorySystemConfig = DEFAULT_MEMORY_CONFIG
): {
  text: string;
  wasModified: boolean;
  confidence: number;
} => {
  console.log("HALLUCINATION PREVENTION: Checking response");
  
  // Special handling for early conversation
  if (isEarlyConversation()) {
    console.log("HALLUCINATION PREVENTION: Early conversation detected");
    
    // Check for risky early statements
    const riskyCheck = detectRiskyEarlyStatements(responseText);
    
    if (riskyCheck.isRisky) {
      console.log(`HALLUCINATION PREVENTION: Risky early statement detected - ${riskyCheck.reason}`);
      const fixedResponse = fixRiskyEarlyStatements(responseText);
      
      return {
        text: fixedResponse,
        wasModified: true,
        confidence: 0.9
      };
    }
  }
  
  // Check for hallucinations in the response
  const hallucinationCheck = detectHallucinations(responseText, userInput, conversationHistory);
  
  // If hallucination detected, apply fix
  if (hallucinationCheck.isHallucination) {
    console.log(`HALLUCINATION PREVENTION: Hallucination detected - ${hallucinationCheck.reason}`);
    
    // Apply correction based on hallucination prevention level
    const correctedResponse = applyHallucinationFix(
      responseText, 
      hallucinationCheck, 
      config.hallucinationPreventionLevel
    );
    
    return {
      text: correctedResponse,
      wasModified: true,
      confidence: 1 - hallucinationCheck.confidence
    };
  }
  
  // If no hallucination detected, return original response
  return {
    text: responseText,
    wasModified: false,
    confidence: hallucinationCheck.confidence
  };
};

/**
 * Apply fix based on hallucination type and prevention level
 */
function applyHallucinationFix(
  responseText: string,
  hallucinationCheck: { 
    isHallucination: boolean; 
    confidence: number; 
    reason?: string 
  },
  preventionLevel: 'low' | 'medium' | 'high' | 'aggressive'
): string {
  // Different strategies based on hallucination type
  if (hallucinationCheck.reason?.includes('memory reference')) {
    return fixMemoryReference(responseText, preventionLevel);
  }
  
  if (hallucinationCheck.reason?.includes('repeated phrase')) {
    return fixRepeatedPhrases(responseText, preventionLevel);
  }
  
  if (hallucinationCheck.reason?.includes('continuity')) {
    return fixContinuityClaim(responseText, preventionLevel);
  }
  
  // Default fix for any other hallucination
  return applyDefaultFix(responseText, preventionLevel);
}

/**
 * Fix false memory references
 */
function fixMemoryReference(
  responseText: string, 
  preventionLevel: 'low' | 'medium' | 'high' | 'aggressive'
): string {
  // Based on prevention level, apply different fixes
  switch (preventionLevel) {
    case 'aggressive':
      // Replace all memory references with present-focused statements
      return responseText
        .replace(/you (mentioned|said|told me|indicated)/gi, "you're saying")
        .replace(/you've been (feeling|experiencing|dealing with)/gi, "you're")
        .replace(/as you (mentioned|said|noted|pointed out)/gi, "from what you're sharing")
        .replace(/earlier you (mentioned|said|talked about)/gi, "you just shared that")
        .replace(/I remember/gi, "I understand")
        .replace(/we (discussed|talked about)/gi, "you mentioned");
        
    case 'high':
      // Replace specific memory claims with hedged language
      return responseText
        .replace(/you (mentioned|said|told me) that ([\w\s]+?)(?=[,.?!])/gi, "it sounds like $2")
        .replace(/I remember ([\w\s]+?)(?=[,.?!])/gi, "I understand $1");
      
    case 'medium':
    case 'low':
      // Add hedging language
      if (!/it seems|from what I understand|if I'm understanding correctly|it sounds like/i.test(responseText)) {
        return "Based on what you're sharing, " + responseText;
      }
      return responseText;
  }
}

/**
 * Fix repeated phrases
 */
function fixRepeatedPhrases(
  responseText: string, 
  preventionLevel: 'low' | 'medium' | 'high' | 'aggressive'
): string {
  // Split into sentences
  const sentences = responseText.split(/(?<=[.!?])\s+/);
  
  // Find unique sentences (remove duplicates)
  const uniqueSentences = Array.from(new Set(sentences));
  
  // Find repeated phrases within sentences and reword them
  const processedSentences = uniqueSentences.map(sentence => {
    // Simple deduplication of phrases
    const words = sentence.split(/\s+/);
    const phrases: Record<string, boolean> = {};
    
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = `${words[i]} ${words[i+1]} ${words[i+2]}`;
      
      // If we've seen this phrase before in this sentence, replace the words
      if (phrases[phrase.toLowerCase()]) {
        if (preventionLevel === 'aggressive' || preventionLevel === 'high') {
          // Replace with alternative wording
          words[i] = '';
          words[i+1] = '';
          words[i+2] = 'this';
        }
      } else {
        phrases[phrase.toLowerCase()] = true;
      }
    }
    
    return words.filter(w => w !== '').join(' ');
  });
  
  return processedSentences.join(' ');
}

/**
 * Fix false continuity claims
 */
function fixContinuityClaim(
  responseText: string, 
  preventionLevel: 'low' | 'medium' | 'high' | 'aggressive'
): string {
  // Replace continuity claims with present-focused language
  if (preventionLevel === 'aggressive' || preventionLevel === 'high') {
    return responseText
      .replace(/as we've been discussing/gi, "based on what you're sharing")
      .replace(/our previous conversation/gi, "what you've shared")
      .replace(/we've been focusing on/gi, "regarding")
      .replace(/as I mentioned (earlier|before|previously)/gi, "")
      .replace(/continuing (from|with) (where we left off|our previous)/gi, "focusing on");
  } else {
    return responseText
      .replace(/as we've been discussing/gi, "from what I understand")
      .replace(/our previous conversation/gi, "our conversation")
      .replace(/we've been focusing on/gi, "regarding");
  }
}

/**
 * Apply default fix for hallucinations
 */
function applyDefaultFix(
  responseText: string, 
  preventionLevel: 'low' | 'medium' | 'high' | 'aggressive'
): string {
  // Default strategy is to make the language more present-focused
  // and less reliant on memory claims
  
  if (preventionLevel === 'aggressive') {
    // Add explicit disclaimer
    return "Based on what you're sharing right now, " + responseText;
  }
  
  if (preventionLevel === 'high') {
    // Add hedging language
    return responseText
      .replace(/^/, "From what I understand, ")
      .replace(/I know/gi, "I understand")
      .replace(/you told me/gi, "you mentioned");
  }
  
  // For medium/low, just return the original
  return responseText;
}
