
/**
 * Check for common minimal expression patterns in user input
 * and provide appropriate responses
 */
export const handleMinimalResponses = (input: string): string | null => {
  const lowerInput = input.toLowerCase();
  
  // Check for common minimal expressions
  if (/\b(tired|exhausted|sleepy)\b/i.test(lowerInput)) {
    return "I hear you're feeling tired. What's been going on?";
  }
  
  if (/\bjust.*tired\b/i.test(lowerInput) || /\ba little tired\b/i.test(lowerInput)) {
    return "Yeah, those tired days can be tough. What's been happening?";
  }
  
  return null;
};
