
/**
 * Enhanced Hallucination Detector V2
 * 
 * Advanced detection system for identifying and preventing hallucinations,
 * with special focus on the first few interactions with a patient
 */

import { MemoryItem } from '../types';
import { isEarlyConversation } from '../systems/earlyConversationHandler';
import { searchMemory, getConversationMessageCount } from '../memoryController';
import { DEFAULT_MEMORY_CONFIG } from '../config';

/**
 * Check if a response contains potential memory references
 */
export const containsMemoryReferences = (text: string): boolean => {
  const memoryPatterns = [
    /you (mentioned|said|told me|indicated|shared|expressed|noted|stated)/i,
    /you've been (feeling|experiencing|dealing with|struggling with|talking about)/i,
    /as you (mentioned|said|noted|pointed out|indicated)/i,
    /earlier you (mentioned|said|talked about|brought up|indicated)/i,
    /I remember/i,
    /we (discussed|talked about)/i,
    /(from|based on) (our|what you|your) (previous|earlier|prior|last)/i
  ];
  
  return memoryPatterns.some(pattern => pattern.test(text));
};

/**
 * Detect potential hallucinations in response text
 */
export const detectHallucinations = (
  responseText: string, 
  userInput: string,
  conversationHistory: string[]
): {
  isHallucination: boolean;
  confidence: number;
  reason?: string;
} => {
  // First, get conversation context
  const messageCount = getConversationMessageCount();
  const isEarlyStage = isEarlyConversation();
  const hasMemoryReferences = containsMemoryReferences(responseText);
  
  // In early conversations, memory references are always risky
  if (isEarlyStage && hasMemoryReferences) {
    return {
      isHallucination: true,
      confidence: 0.95,
      reason: "Memory reference in early conversation"
    };
  }
  
  // Check for specific patterns that indicate non-grounded statements
  const specificHallucinations = detectSpecificHallucinations(responseText, conversationHistory);
  if (specificHallucinations.isHallucination) {
    return specificHallucinations;
  }
  
  // If response contains memory references, verify them against actual memory
  if (hasMemoryReferences) {
    // Get topics and key phrases from the user input
    const keyPhrases = extractKeyPhrases(userInput);
    
    // Search memory for relevant items
    const relevantMemories = searchMemory({
      keywords: keyPhrases,
      role: 'patient',
      limit: 5
    });
    
    // If we found no memories but are making memory claims, that's a hallucination
    if (relevantMemories.length === 0) {
      return {
        isHallucination: true,
        confidence: 0.85,
        reason: "Memory reference with no supporting memories"
      };
    }
    
    // Verify memory references against actual memories (simplified check)
    // A more robust system would use semantic similarity here
    const memoryVerification = verifyMemoryReferences(responseText, relevantMemories);
    
    if (!memoryVerification.isVerified) {
      return {
        isHallucination: true,
        confidence: 0.8,
        reason: memoryVerification.reason
      };
    }
  }
  
  // If we reach here, no hallucinations detected
  return {
    isHallucination: false,
    confidence: hasMemoryReferences ? 0.7 : 0.9 // Lower confidence when memory is referenced
  };
};

/**
 * Detect specific hallucination patterns
 */
function detectSpecificHallucinations(
  responseText: string,
  conversationHistory: string[]
): {
  isHallucination: boolean;
  confidence: number;
  reason?: string;
} {
  // Check for repeated phrases (common in hallucinations)
  const repeatedPhraseCheck = detectRepeatedPhrases(responseText);
  if (repeatedPhraseCheck.hasRepeats) {
    return {
      isHallucination: true,
      confidence: 0.85,
      reason: `Repeated phrases detected: "${repeatedPhraseCheck.repeatedPhrase}"`
    };
  }
  
  // Check for false continuity claims
  const falseContinuityCheck = detectFalseContinuityClaims(responseText, conversationHistory);
  if (falseContinuityCheck.hasFalseClaims) {
    return {
      isHallucination: true,
      confidence: 0.9,
      reason: falseContinuityCheck.reason
    };
  }
  
  return {
    isHallucination: false,
    confidence: 0.5
  };
}

/**
 * Extract key phrases from text
 */
function extractKeyPhrases(text: string): string[] {
  // Simple implementation - split by spaces and punctuation
  // A proper implementation would use NLP techniques
  const words = text.toLowerCase().split(/[\s,.!?;:()[\]{}'"]+/);
  
  // Filter out common stop words
  const stopWords = new Set([
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 
    'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 
    'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 
    'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 
    'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 
    'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 
    'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 
    'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 
    'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
    'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 
    'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 
    'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 
    'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very'
  ]);
  
  // Get phrases (individual words for now, but could be n-grams)
  const phrases = words
    .filter(word => word.length > 3 && !stopWords.has(word))
    .slice(0, 10); // Limit to 10 key phrases
    
  return phrases;
}

/**
 * Detect repeated phrases in text
 */
function detectRepeatedPhrases(text: string): {
  hasRepeats: boolean;
  repeatedPhrase?: string;
  repeatCount?: number;
} {
  // Split into sentences
  const sentences = text.split(/[.!?]+/);
  
  // Create 3-word phrases from each sentence
  const phrases: Record<string, number> = {};
  
  for (const sentence of sentences) {
    const words = sentence.trim().toLowerCase().split(/\s+/);
    if (words.length < 3) continue;
    
    for (let i = 0; i <= words.length - 3; i++) {
      const phrase = `${words[i]} ${words[i+1]} ${words[i+2]}`;
      phrases[phrase] = (phrases[phrase] || 0) + 1;
      
      if (phrases[phrase] > 1) {
        return {
          hasRepeats: true,
          repeatedPhrase: phrase,
          repeatCount: phrases[phrase]
        };
      }
    }
  }
  
  return { hasRepeats: false };
}

/**
 * Detect false continuity claims
 */
function detectFalseContinuityClaims(
  responseText: string,
  conversationHistory: string[]
): {
  hasFalseClaims: boolean;
  reason?: string;
} {
  // Only check if we have limited conversation history
  if (conversationHistory.length <= 2) {
    const continuityPatterns = [
      {
        pattern: /as we've been discussing/i,
        reason: "False ongoing discussion claim"
      },
      {
        pattern: /our previous conversation/i,
        reason: "False previous conversation claim"
      },
      {
        pattern: /we've been focusing on/i,
        reason: "False ongoing focus claim"
      },
      {
        pattern: /as I mentioned (earlier|before|previously)/i,
        reason: "False prior statement claim"
      },
      {
        pattern: /continuing (from|with) (where we left off|our previous)/i,
        reason: "False continuation claim"
      }
    ];
    
    for (const {pattern, reason} of continuityPatterns) {
      if (pattern.test(responseText)) {
        return { hasFalseClaims: true, reason };
      }
    }
  }
  
  return { hasFalseClaims: false };
}

/**
 * Verify memory references against actual memories
 */
function verifyMemoryReferences(
  responseText: string,
  memories: MemoryItem[]
): {
  isVerified: boolean;
  reason?: string;
} {
  // This is a simplified implementation
  // A more robust version would use NLP and embeddings to verify claims
  
  // Extract claimed topics from the response
  const claimedTopics = extractClaimedTopics(responseText);
  
  // If no specific claims, consider it verified
  if (claimedTopics.length === 0) {
    return { isVerified: true };
  }
  
  // Get all memory content as a single string for simple matching
  const memoryContent = memories.map(m => m.content.toLowerCase()).join(' ');
  
  // Check if each claimed topic appears in the memories
  const unverifiedTopics = claimedTopics.filter(topic => !memoryContent.includes(topic.toLowerCase()));
  
  if (unverifiedTopics.length > 0) {
    return {
      isVerified: false,
      reason: `Unverified memory claims: ${unverifiedTopics.join(', ')}`
    };
  }
  
  return { isVerified: true };
}

/**
 * Extract claimed topics from response text
 */
function extractClaimedTopics(text: string): string[] {
  const topics: string[] = [];
  
  // Look for phrases after "you mentioned", "you said", etc.
  const mentionMatches = text.match(/you (mentioned|said|told me|indicated|shared|expressed) ([\w\s]+?)(?=[,.?!])/gi);
  
  if (mentionMatches) {
    mentionMatches.forEach(match => {
      const parts = match.split(/(mentioned|said|told me|indicated|shared|expressed)/i);
      if (parts.length >= 2) {
        const topic = parts[2].trim();
        if (topic && topic.length > 3) {
          topics.push(topic);
        }
      }
    });
  }
  
  return topics;
}
