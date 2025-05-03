/**
 * Grammar Correction
 * 
 * Ensures responses have proper grammar and are well-formatted
 */

/**
 * Correct grammar and formatting issues in responses
 * @param response The response text to correct
 * @param userInput Optional user input to help adjust response length
 * @returns Corrected response text
 */
export const correctGrammar = (
  response: string,
  userInput?: string
): string => {
  try {
    // If response is empty, return a default
    if (!response || response.trim() === '') {
      return "I'm here to listen. What else would you like to share?";
    }

    let corrected = response.trim();
    
    // Remove redundant sentence starters like "I wonder if", "Perhaps we might", etc.
    corrected = corrected
      // Remove doubled sentence starters
      .replace(/(\w+) we might,?\s+\1 we might/gi, '$1 we might')
      .replace(/(perhaps|maybe) we might,?\s+(perhaps|maybe) we might/gi, '$1 we might')
      .replace(/I wonder if,?\s+I wonder if/gi, 'I wonder if')
      .replace(/(perhaps|maybe),?\s+(perhaps|maybe)/gi, '$1')
      
      // Fix comma splices and run-on sentences
      .replace(/(.{20,}?[.!?]),\s+([A-Z])/g, '$1 $2')
      
      // Fix "I wonder if experiences like these often reveal" pattern
      .replace(/I wonder if (.*?) often reveal/gi, 'I wonder if $1 reveals')
      
      // Fix common grammar patterns in Roger's responses
      .replace(/experiences like these/gi, 'experiences like this')
      
      // Replace awkward transitions
      .replace(/Another aspect, /gi, 'Another aspect is that ')
      .replace(/Another aspect worth/gi, 'Another thing worth')
      
      // Improve flow between thoughts
      .replace(/\.\s+On another note,/gi, '. ')
      .replace(/\.\s+Another aspect/gi, '. ')
      
      // Fix common issues with "perhaps we might"
      .replace(/Perhaps we might (.+?), Perhaps we might/gi, 'Perhaps we might $1. Maybe');

    // Ensure proper punctuation
    if (!/[.!?]$/.test(corrected)) {
      corrected += '.';
    }
    
    // Adjust response length based on user input length
    if (userInput) {
      const userWords = userInput.split(/\s+/).length;
      const responseWords = corrected.split(/\s+/).length;
      
      // For very short user inputs (like "What?"), keep responses concise
      if (userWords < 5 && responseWords > 15) {
        // Extract first sentence only
        const firstSentence = corrected.split(/[.!?](\s|$)/)[0] + '.';
        return firstSentence;
      }
      
      // For medium-length user messages, aim for proportional response length
      if (userWords < 10 && responseWords > 25) {
        // Try to extract first 1-2 sentences depending on length
        const sentences = corrected.match(/[^.!?]+[.!?]+/g) || [corrected];
        if (sentences.length > 1) {
          return sentences.slice(0, 2).join(' ');
        }
      }
    }
    
    return corrected;
  } catch (error) {
    console.error('Error in grammar correction:', error);
    return response; // Return original if correction fails
  }
};
