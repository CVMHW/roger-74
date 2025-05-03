
/**
 * Socratic dialogue responses for logotherapy
 */

/**
 * Generate a response using Socratic dialogue approach
 * (Based on logotherapy's approach to helping people discover meaning)
 */
export const generateSocraticLogotherapyResponse = (userInput: string): string => {
  const socraticResponses = [
    "What would you say gives your life meaning right now, even in small ways?",
    "If you were to imagine your life as meaningful and purposeful, what would be different from how things are now?",
    "What activities make you lose track of time because you find them so engaging and worthwhile?",
    "When have you felt most alive or like you were living with purpose?",
    "What legacy would you like to leave, or what difference would you like to make in the world?",
    "What values would you want to guide your choices, regardless of your circumstances?",
    "When you think about what gives life meaning, what comes to mind for you personally?",
    "What strengths or gifts do you have that you feel called to express or contribute?",
    "If meaning comes from what we give to the world, what we experience, or how we face suffering - which of these pathways feels most relevant to you right now?",
    "What helps you transcend your immediate concerns and connect to something larger than yourself?"
  ];
  
  return socraticResponses[Math.floor(Math.random() * socraticResponses.length)];
};
