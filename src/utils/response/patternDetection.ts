
/**
 * Conversation Pattern Detection
 * 
 * Specialized utility for detecting patterns in conversations
 * and preventing repetitive interaction loops
 */

interface PatternDetectionResult {
  isRepetitive: boolean;
  detectedPatterns: string[];
  repetitionScore: number;
  recommendations: {
    increaseSpontaneity: boolean;
    changeApproach: boolean;
    forcePerspectiveShift: boolean;
  };
}

/**
 * Detects patterns in conversation that might indicate repetition or staleness
 */
export const detectConversationPatterns = (
  currentResponse: string,
  previousResponses: string[] = [],
  userMessages: string[] = []
): PatternDetectionResult => {
  const result: PatternDetectionResult = {
    isRepetitive: false,
    detectedPatterns: [],
    repetitionScore: 0,
    recommendations: {
      increaseSpontaneity: false,
      changeApproach: false,
      forcePerspectiveShift: false
    }
  };
  
  // If we don't have enough history, return default result
  if (previousResponses.length === 0) {
    return result;
  }
  
  // Check for common repetitive phrases
  const repetitivePatterns = [
    {
      regex: /I notice I may have been repeating myself/i,
      pattern: 'meta-acknowledgment',
      weight: 1.0
    },
    {
      regex: /It seems like you shared that/i,
      pattern: 'generic-acknowledgment',
      weight: 1.0
    },
    {
      regex: /I'd like to focus specifically on/i,
      pattern: 'redirection-attempt',
      weight: 0.8
    },
    {
      regex: /I hear you('re| are) feeling/i,
      pattern: 'feeling-reflection',
      weight: 0.7
    },
    {
      regex: /would you like to tell me more about/i,
      pattern: 'generic-prompt',
      weight: 0.6
    },
    {
      regex: /that sounds (difficult|challenging|hard)/i,
      pattern: 'generic-empathy',
      weight: 0.5
    }
  ];
  
  // Check current response for these patterns
  for (const pattern of repetitivePatterns) {
    if (pattern.regex.test(currentResponse)) {
      result.detectedPatterns.push(pattern.pattern);
      result.repetitionScore += pattern.weight;
    }
  }
  
  // Now check if these patterns were also in previous responses
  for (const pattern of repetitivePatterns) {
    for (const prevResponse of previousResponses) {
      if (pattern.regex.test(prevResponse) && pattern.regex.test(currentResponse)) {
        // Double the weight for repeated patterns
        result.repetitionScore += pattern.weight;
        if (!result.detectedPatterns.includes(`repeated-${pattern.pattern}`)) {
          result.detectedPatterns.push(`repeated-${pattern.pattern}`);
        }
      }
    }
  }
  
  // Check for sentence structure repetition
  const currentStructure = getSentenceStructure(currentResponse);
  const previousStructures = previousResponses.map(getSentenceStructure);
  
  for (let i = 0; i < previousStructures.length; i++) {
    const similarity = calculateStructureSimilarity(currentStructure, previousStructures[i]);
    if (similarity > 0.6) { // Threshold for similar structure
      result.repetitionScore += 0.5;
      result.detectedPatterns.push('similar-sentence-structure');
      break;
    }
  }
  
  // Check for question repetition
  const currentQuestions = extractQuestions(currentResponse);
  
  for (const prevResponse of previousResponses) {
    const prevQuestions = extractQuestions(prevResponse);
    
    for (const currentQ of currentQuestions) {
      for (const prevQ of prevQuestions) {
        if (calculateSimilarity(currentQ, prevQ) > 0.7) { // Threshold for similar questions
          result.repetitionScore += 0.8;
          result.detectedPatterns.push('repeated-question');
          break;
        }
      }
    }
  }
  
  // Set final result based on repetition score
  if (result.repetitionScore >= 1.0) {
    result.isRepetitive = true;
    
    // Set recommendations based on score
    result.recommendations = {
      increaseSpontaneity: true,
      changeApproach: result.repetitionScore >= 1.5,
      forcePerspectiveShift: result.repetitionScore >= 2.0
    };
  }
  
  return result;
};

/**
 * Extract a simplified representation of sentence structure
 */
const getSentenceStructure = (text: string): string[] => {
  // Split into sentences
  const sentences = text.split(/[.!?]\s+/);
  
  return sentences.map(sentence => {
    // Create a simple structural representation
    const words = sentence.toLowerCase().trim().split(/\s+/);
    
    if (words.length === 0) return '';
    
    let structure = '';
    
    // Add first word
    if (words.length > 0) structure += words[0] + ' ';
    
    // Add sentence length marker
    structure += `[${words.length}] `;
    
    // Add last two words if available
    if (words.length > 2) structure += words[words.length - 2] + ' ' + words[words.length - 1];
    else if (words.length > 1) structure += words[words.length - 1];
    
    return structure;
  });
};

/**
 * Calculate similarity between sentence structures
 */
const calculateStructureSimilarity = (struct1: string[], struct2: string[]): number => {
  // Handle empty structures
  if (struct1.length === 0 || struct2.length === 0) return 0;
  
  // Count matching structures
  let matchCount = 0;
  const minLength = Math.min(struct1.length, struct2.length);
  
  for (let i = 0; i < minLength; i++) {
    if (struct1[i] === struct2[i]) {
      matchCount++;
    }
  }
  
  return matchCount / minLength;
};

/**
 * Extract questions from text
 */
const extractQuestions = (text: string): string[] => {
  // Split by question marks
  const parts = text.split('?');
  const questions: string[] = [];
  
  // Last part doesn't end with question mark
  for (let i = 0; i < parts.length - 1; i++) {
    // Find the start of the question (after previous ? or start of text)
    let startIndex = 0;
    if (i > 0) {
      startIndex = parts[i-1].lastIndexOf('.') + 1;
      if (startIndex === 0) startIndex = parts[i-1].lastIndexOf('!') + 1;
      if (startIndex === 0) startIndex = 0;
    }
    
    const question = parts[i].substr(startIndex).trim() + '?';
    if (question.length > 5) {  // Ignore very short questions
      questions.push(question);
    }
  }
  
  return questions;
};

/**
 * Calculate text similarity
 */
const calculateSimilarity = (text1: string, text2: string): number => {
  // Convert to lowercase and split into words
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  // Count matching words
  let matchCount = 0;
  
  for (const word1 of words1) {
    if (words2.includes(word1)) {
      matchCount++;
    }
  }
  
  // Calculate similarity ratio
  return words1.length > 0 ? matchCount / words1.length : 0;
};

/**
 * Check for repetition of topics across multiple messages
 */
export const detectTopicRepetition = (messages: string[]): boolean => {
  if (messages.length < 3) return false;
  
  // Check recent messages
  const recentMessages = messages.slice(-3);
  const topics = extractTopics(recentMessages.join(' '));
  
  // If enough distinct topics, not repetitive
  return topics.length < 2;
};

/**
 * Extract topics from text
 */
const extractTopics = (text: string): string[] => {
  const lowerText = text.toLowerCase();
  const topics = new Set<string>();
  
  // Define topic keywords
  const topicPatterns: Record<string, RegExp> = {
    'social': /friend|social|conversation|people|talk|communicate/i,
    'anxiety': /nervous|anxious|worry|stress|overwhelm/i,
    'work': /job|career|work|boss|coworker|office/i,
    'family': /family|parent|mom|dad|brother|sister/i,
    'emotion': /feel|feeling|emotion|sad|happy|angry|upset/i,
    'identity': /who I am|identity|self|value|worth|meaning/i,
    'relationship': /relationship|partner|boyfriend|girlfriend|marriage|date/i,
    'health': /health|sick|doctor|hospital|pain|symptom/i
  };
  
  // Check for each topic
  for (const [topic, pattern] of Object.entries(topicPatterns)) {
    if (pattern.test(lowerText)) {
      topics.add(topic);
    }
  }
  
  return Array.from(topics);
};
