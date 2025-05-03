
/**
 * Detection utilities for analyzing message content
 */

// Function to check for critical keywords in user input
export const containsCriticalKeywords = (text: string): boolean => {
  const lowerText = text.toLowerCase().trim();
  return /suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)|don'?t want to (live|be alive)|take my (own )?life|killing myself|commit suicide|die by suicide|fatal overdose|hang myself|jump off|i wish i was dead|i want to die|i might kill|crisis|emergency|urgent|need help now|immediate danger/.test(lowerText);
};

// Function to check if user input is about pet death or loss
export const isPetLossContent = (text: string): boolean => {
  const lowerText = text.toLowerCase().trim();
  return /pet|dog|cat|animal|died|passed away|molly|death|lost|grave|euthan/.test(lowerText);
};

// Function to check if Roger is being non-responsive or repetitive
export const isUserPointingOutNonResponsiveness = (text: string): boolean => {
  const lowerText = text.toLowerCase().trim();
  return /already told you|just said that|weren't listening|not listening|didn't hear|didn't read|ignoring|pay attention|listen to me|read what i wrote|i just told you|i said|i mentioned|you asked|you're repeating|you just asked|you already asked/.test(lowerText);
};
