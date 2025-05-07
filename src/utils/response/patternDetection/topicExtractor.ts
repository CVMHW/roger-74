
/**
 * Functions for extracting and analyzing topics in text
 */

/**
 * Extract topics from text
 */
export const extractTopics = (text: string): string[] => {
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
