
/**
 * Attitudinal values responses for logotherapy
 */

/**
 * Generate a response focused on finding meaning through attitude toward suffering
 * (Attitudinal values - the third pathway to meaning in logotherapy)
 */
export const generateAttitudinalValuesResponse = (userInput: string): string => {
  const attitudinalValuesResponses = [
    "Viktor Frankl found that even in unavoidable suffering, we retain the freedom to choose our attitude. How have difficult experiences in your life shaped who you are today?",
    "Sometimes our greatest meaning comes from how we face unavoidable challenges. What has helped you find strength during difficult times?",
    "The third pathway to meaning involves the stance we take toward suffering we cannot avoid. How have you been able to make sense of difficult experiences?",
    "Even in circumstances we can't control, we retain the freedom to choose our response to them. What has helped you face challenges with dignity?",
    "Meaning can emerge from how we choose to face unavoidable suffering. Have there been times when a difficult experience eventually led to growth or new perspective?",
    "Our attitude toward circumstances we cannot change reveals our deepest values. What values have helped you navigate difficult situations?"
  ];
  
  return attitudinalValuesResponses[Math.floor(Math.random() * attitudinalValuesResponses.length)];
};
