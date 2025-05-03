
/**
 * Helper utilities for extracting topics from conversation
 */

/**
 * Extract key topics from user input for contextual responses
 */
export const extractKeyTopics = (input: string): string[] => {
  const topics = [];
  const topicPatterns = [
    { regex: /wrench|tool|lost|find|found|missing/i, topic: "your lost wrench" },
    { regex: /storm|electricity|power|outage/i, topic: "the power outage" },
    { regex: /presentation|work|job|boss|meeting|deadline/i, topic: "your work presentation" },
    { regex: /laptop|computer|device|phone|mobile/i, topic: "technology issues" },
    { regex: /frustrat(ed|ing)|upset|angry|mad|stress(ed|ful)/i, topic: "your frustration" },
    { regex: /anxious|anxiety|worry|concern/i, topic: "your anxiety" },
    { regex: /sad|down|depress(ed|ing)|unhappy/i, topic: "your feelings" }
  ];
  
  for (const pattern of topicPatterns) {
    if (pattern.regex.test(input.toLowerCase()) && !topics.includes(pattern.topic)) {
      topics.push(pattern.topic);
    }
  }
  
  return topics;
};

/**
 * Get appropriate adjective based on topics
 */
export const getAppropriateAdjective = (topics: string[]): string => {
  if (topics.some(topic => 
    topic.includes("frustration") || 
    topic.includes("anxiety") || 
    topic.includes("feelings") ||
    topic.includes("lost wrench")
  )) {
    return "difficult";
  }
  
  if (topics.some(topic => 
    topic.includes("power outage") || 
    topic.includes("technology issues") ||
    topic.includes("work presentation")
  )) {
    return "challenging";
  }
  
  return "important to address";
};
