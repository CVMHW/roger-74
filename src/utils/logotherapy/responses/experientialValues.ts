
/**
 * Experiential values responses for logotherapy
 */

/**
 * Generate a response focused on finding meaning through experiences and love
 * (Experiential values - the second pathway to meaning in logotherapy)
 */
export const generateExperientialValuesResponse = (userInput: string): string => {
  const experientialValuesResponses = [
    "Another pathway to meaning is through what we experience and receive from the world - like love, beauty, or truth. What experiences have felt particularly meaningful to you?",
    "Deep connections with others can be profound sources of meaning. Which relationships in your life feel most meaningful, and what makes them so?",
    "Sometimes meaning reveals itself in moments of beauty or awe. Have you had experiences that gave you a sense of being connected to something larger than yourself?",
    "Frankl observed that experiencing something fully - or loving someone deeply - can provide a powerful sense of meaning. What experiences in your life have felt most meaningful?",
    "The capacity to appreciate beauty, connection, or truth can reveal what we value most. What experiences move you or touch you deeply?",
    "Being fully present to experience life's moments - both joyful and difficult - can be a source of meaning. What helps you be more present in your experiences?"
  ];
  
  return experientialValuesResponses[Math.floor(Math.random() * experientialValuesResponses.length)];
};
