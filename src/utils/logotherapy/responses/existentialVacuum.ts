
/**
 * Existential vacuum responses for logotherapy
 */

/**
 * Generate a response addressing the existential vacuum (feelings of emptiness or meaninglessness)
 */
export const generateExistentialVacuumResponse = (userInput: string): string => {
  const existentialVacuumResponses = [
    "That feeling of emptiness or lack of purpose is what Frankl called the 'existential vacuum.' It often signals we're ready to discover more authentic meaning in our lives. What activities make you lose track of time?",
    "Feelings of emptiness often point us toward our need for meaning. What activities or experiences have felt genuinely meaningful to you, even if just briefly?",
    "The existential vacuum - that sense that something is missing - can actually be the beginning of a meaningful search. What matters most to you, beyond achievement or pleasure?",
    "Frankl believed that when we feel empty or without purpose, it's not a pathology but a call to discover authentic meaning. What values would you want to express more in your life?",
    "That sense of meaninglessness is actually a human response to the absence of something vital - purpose. What gives you even a glimpse of meaning or purpose?",
    "The feeling that something is missing can be the first step toward discovering what truly matters to you. When have you felt most alive or purposeful?"
  ];
  
  return existentialVacuumResponses[Math.floor(Math.random() * existentialVacuumResponses.length)];
};
