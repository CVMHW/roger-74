
/**
 * Pattern fixing functionality
 * 
 * Addresses dangerous repetition patterns and common problematic phrases
 */

/**
 * Fix dangerous repetition patterns in responses
 */
export const fixDangerousRepetitionPatterns = (responseText: string): {
  fixedResponse: string;
  hasRepetitionIssue: boolean;
} => {
  const repetitionPatterns = [
    {
      pattern: /(I hear (you'?re|you are) dealing with) I hear (you'?re|you are) dealing with/i,
      replacement: '$1'
    },
    {
      pattern: /(I hear (you'?re|you are) dealing with) you may have indicated/i,
      replacement: '$1'
    },
    {
      pattern: /you may have indicated Just a/i,
      replacement: 'with a'
    },
    {
      pattern: /you may have indicated Just/i,
      replacement: 'with'
    },
    {
      pattern: /you may have indicated/i, // Added to catch all instances
      replacement: 'about'
    },
    {
      pattern: /(I remember (you|your|we)) I remember (you|your|we)/i,
      replacement: '$1'
    },
    {
      pattern: /(you (mentioned|said|told me)) you (mentioned|said|told me)/i,
      replacement: '$1'
    },
    {
      pattern: /(I hear you're feeling) (I hear you're feeling)/i,
      replacement: '$1'
    },
    // New patterns to catch from recent issues
    {
      pattern: /dealing with you may have indicated/i,
      replacement: 'dealing with'
    },
    {
      pattern: /I hear (you'?re|you are) dealing with.*?I hear/i,
      replacement: 'I hear'
    },
    // Add patterns to remove diagnoses/labels related content
    {
      pattern: /I understand that (labels|diagnoses) (can|may) sometimes feel uncomfortable/i,
      replacement: "I'm here to listen and support you"
    },
    {
      pattern: /It's completely okay to see your experiences in your own way/i,
      replacement: "Would you like to tell me more about how you're feeling?"
    },
    {
      pattern: /labels or diagnoses/i,
      replacement: "these situations"
    }
  ];
  
  let fixedResponse = responseText;
  let hasRepetitionIssue = false;
  
  // Apply repetition fixes
  for (const { pattern, replacement } of repetitionPatterns) {
    if (pattern.test(fixedResponse)) {
      console.warn("REPETITION DETECTED: Fixing repeated phrases");
      fixedResponse = fixedResponse.replace(pattern, replacement);
      hasRepetitionIssue = true;
    }
  }
  
  // Secondary fix for the "you may have indicated Just" issue that might be missed
  if (/you may have indicated/i.test(fixedResponse)) {
    console.warn("REPETITION DETECTED: Fixing 'you may have indicated' phrase");
    fixedResponse = fixedResponse.replace(/you may have indicated/gi, "about");
    hasRepetitionIssue = true;
  }
  
  // Check for diagnoses or labels mentions that shouldn't be there
  if (/diagnoses|labels|diagnostic|uncomfortable way/i.test(fixedResponse)) {
    console.warn("CONTENT ERROR: Removing inappropriate diagnoses or labels references");
    fixedResponse = fixedResponse.replace(
      /I understand that (labels|diagnoses) can sometimes feel uncomfortable\. It's completely okay to see your experiences in your own way\./gi, 
      "I'm listening to what you're sharing."
    );
    hasRepetitionIssue = true;
  }
  
  return {
    fixedResponse,
    hasRepetitionIssue
  };
};
