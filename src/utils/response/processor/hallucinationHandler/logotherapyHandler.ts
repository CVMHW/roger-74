/**
 * Logotherapy Hallucination Handler
 * 
 * Specialized handler for preventing hallucinations in logotherapeutic responses
 */

import { MemoryPiece } from '../../../memory/memoryBank';

/**
 * Handle potential hallucinations in logotherapeutic responses
 */
export const handleLogotherapyHallucinations = (
  response: string,
  userInput: string,
  conversationHistory: string[],
  memories: MemoryPiece[]
): {
  processedResponse: string;
  wasHallucinationDetected: boolean;
} => {
  try {
    // Check for references to past conversations that might not exist
    const hasFalsePastReference = checkFalsePastReference(response, conversationHistory);
    
    // Check for references to philosophical frameworks not mentioned
    const hasPhilosophicalHallucination = checkPhilosophicalHallucination(response, userInput, conversationHistory);
    
    // Check for false attributions to specific philosophers
    const hasPhilosopherAttribution = checkPhilosopherAttribution(response, userInput);
    
    // If no issues detected, return original
    if (!hasFalsePastReference && !hasPhilosophicalHallucination && !hasPhilosopherAttribution) {
      return {
        processedResponse: response,
        wasHallucinationDetected: false
      };
    }
    
    // Apply appropriate fixes
    let fixedResponse = response;
    
    if (hasFalsePastReference) {
      fixedResponse = fixPastReferences(fixedResponse);
    }
    
    if (hasPhilosophicalHallucination) {
      fixedResponse = fixPhilosophicalFrameworks(fixedResponse);
    }
    
    if (hasPhilosopherAttribution) {
      fixedResponse = fixPhilosopherAttributions(fixedResponse);
    }
    
    return {
      processedResponse: fixedResponse,
      wasHallucinationDetected: true
    };
    
  } catch (error) {
    console.error("Error handling logotherapy hallucinations:", error);
    return {
      processedResponse: response,
      wasHallucinationDetected: false
    };
  }
};

/**
 * Check for false references to past conversations
 */
const checkFalsePastReference = (
  response: string, 
  conversationHistory: string[]
): boolean => {
  // Look for phrases indicating reference to past conversation
  const pastReferencePatterns = [
    /as (we|you) (mentioned|discussed|talked about) (earlier|before|previously)/i,
    /you (told|shared with) me (earlier|before|previously|last time)/i,
    /in our (previous|earlier|last|prior) (conversation|session|discussion)/i,
    /when we (last|previously) (spoke|talked|met)/i
  ];
  
  // If no references to past conversation, no false reference
  const hasPastReference = pastReferencePatterns.some(pattern => pattern.test(response));
  if (!hasPastReference) {
    return false;
  }
  
  // If this is the first message, any past reference is false
  if (conversationHistory.length <= 2) {
    return true;
  }
  
  // Otherwise, need more sophisticated checking
  // This would involve checking if the content actually matches past conversation
  // For now, a simplistic implementation
  return false;
};

/**
 * Check for hallucinated philosophical frameworks
 */
const checkPhilosophicalHallucination = (
  response: string,
  userInput: string,
  conversationHistory: string[]
): boolean => {
  // Philosophical frameworks to check for
  const frameworks = [
    'existentialism',
    'nihilism',
    'stoicism',
    'absurdism',
    'determinism',
    'empiricism',
    'utilitarianism'
  ];
  
  // Look for mentions in response
  const mentionedFrameworks = frameworks.filter(framework => 
    new RegExp(`\\b${framework}\\b`, 'i').test(response)
  );
  
  if (mentionedFrameworks.length === 0) {
    return false;
  }
  
  // Check if any were mentioned by user
  const userMentionedFrameworks = frameworks.filter(framework =>
    new RegExp(`\\b${framework}\\b`, 'i').test(userInput)
  );
  
  // Check conversation history
  const historyMentionedFrameworks = frameworks.filter(framework =>
    conversationHistory.some(msg => new RegExp(`\\b${framework}\\b`, 'i').test(msg))
  );
  
  // Combine user and history mentions
  const validFrameworks = [...new Set([...userMentionedFrameworks, ...historyMentionedFrameworks])];
  
  // For each mentioned framework, check if it's valid
  for (const framework of mentionedFrameworks) {
    if (!validFrameworks.includes(framework)) {
      return true; // Hallucination detected
    }
  }
  
  return false;
};

/**
 * Check for false attributions to philosophers
 */
const checkPhilosopherAttribution = (
  response: string,
  userInput: string
): boolean => {
  // Philosophers to check for
  const philosophers = [
    'Frankl',
    'Viktor Frankl',
    'Nietzsche',
    'Sartre',
    'Camus',
    'Kierkegaard',
    'Heidegger',
    'Schopenhauer',
    'Socrates',
    'Plato',
    'Aristotle'
  ];
  
  // Check if any philosophers are mentioned in response
  const mentionedPhilosophers = philosophers.filter(philosopher => 
    new RegExp(`\\b${philosopher}\\b`, 'i').test(response)
  );
  
  if (mentionedPhilosophers.length === 0) {
    return false;
  }
  
  // Check if user mentioned any of these philosophers
  const userMentionedPhilosophers = philosophers.filter(philosopher =>
    new RegExp(`\\b${philosopher}\\b`, 'i').test(userInput)
  );
  
  // For each mentioned philosopher, check if user mentioned them
  for (const philosopher of mentionedPhilosophers) {
    if (!userMentionedPhilosophers.includes(philosopher)) {
      // Special case: Allow Viktor Frankl references (logotherapy founder)
      if (philosopher === 'Frankl' || philosopher === 'Viktor Frankl') {
        continue;
      }
      return true; // Hallucination detected
    }
  }
  
  return false;
};

/**
 * Fix false references to past conversations
 */
const fixPastReferences = (response: string): string => {
  return response
    .replace(/as (we|you) (mentioned|discussed|talked about) (earlier|before|previously)/gi, "from what you're sharing")
    .replace(/you (told|shared with) me (earlier|before|previously|last time)/gi, "you're saying")
    .replace(/in our (previous|earlier|last|prior) (conversation|session|discussion)/gi, "in our discussion")
    .replace(/when we (last|previously) (spoke|talked|met)/gi, "as we talk");
};

/**
 * Fix hallucinated philosophical frameworks
 */
const fixPhilosophicalFrameworks = (response: string): string => {
  return response
    .replace(/in (existentialism|nihilism|stoicism|absurdism|determinism)/gi, "in some philosophical perspectives")
    .replace(/from an? (existentialist|nihilist|stoic|absurdist|determinist) (perspective|viewpoint|standpoint)/gi, "from a certain philosophical perspective")
    .replace(/according to (existentialism|nihilism|stoicism|absurdism|determinism)/gi, "according to some philosophical views");
};

/**
 * Fix false attributions to philosophers
 */
const fixPhilosopherAttributions = (response: string): string => {
  // Allow Frankl references but modify other philosopher attributions
  const otherPhilosophers = [
    'Nietzsche',
    'Sartre',
    'Camus',
    'Kierkegaard',
    'Heidegger',
    'Schopenhauer',
    'Socrates',
    'Plato',
    'Aristotle'
  ];
  
  let fixedResponse = response;
  
  for (const philosopher of otherPhilosophers) {
    fixedResponse = fixedResponse.replace(
      new RegExp(`(as|like|according to) ${philosopher} (said|noted|observed|stated|pointed out|believed|thought)`, 'gi'),
      "as some philosophers suggest"
    );
    
    fixedResponse = fixedResponse.replace(
      new RegExp(`${philosopher} (said|noted|observed|stated|pointed out|believed|thought)`, 'gi'),
      "Philosophers suggest"
    );
  }
  
  return fixedResponse;
};

export default handleLogotherapyHallucinations;
