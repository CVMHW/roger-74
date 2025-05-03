
/**
 * Token-level analysis for hallucination detection
 */

/**
 * Generate token-level analysis for the response
 */
export const generateTokenLevelAnalysis = (responseText: string) => {
  // In a real implementation, this would use a pre-trained model
  // This is a simplified placeholder version
  
  const tokens = responseText.split(/\s+/);
  const scores = Array(tokens.length).fill(1.0);
  
  // Flag tokens that might be problematic
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Risk indicators: numbers, dates, named entities
    if (/^\d+$/.test(token)) {
      scores[i] = 0.7; // Numbers are somewhat risky
    }
    
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(token)) {
      scores[i] = 0.6; // Dates are more risky
    }
    
    // Check for phrases that often indicate hallucination
    const riskPhrases = ['remember', 'mentioned', 'told', 'said', 'discussed'];
    if (riskPhrases.includes(token.toLowerCase())) {
      scores[i] = 0.5; // These tokens trigger more scrutiny
    }
  }
  
  return {
    tokens,
    scores
  };
};

/**
 * Generate corrections for hallucinated content
 */
export const generateCorrection = (
  responseText: string, 
  flags: { type: string, severity: string }[]
): string => {
  // For critical memory hallucinations, create appropriate replacements
  if (flags.some(f => f.type === 'memory_reference' && f.severity === 'high')) {
    // Replace memory claims with neutral statements
    let corrected = responseText.replace(
      /(?:I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about|we've been focusing on) (?:that |how |about |your |having |feeling |experiencing |)([\w\s]+)/gi,
      "What you're sharing about $1"
    );
    
    // Replace "we've discussed" patterns
    corrected = corrected.replace(
      /we(?:'ve| have) discussed ([\w\s]+)/gi,
      "you're bringing up $1"
    );
    
    // Remove timeline references
    corrected = corrected.replace(
      /(last time|previously|before|earlier|in our previous session)/gi,
      ""
    );
    
    return corrected;
  }
  
  // For repetition hallucinations, simplify the response
  if (flags.some(f => f.type === 'logical_error' || f.type === 'contradiction')) {
    const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const uniqueSentences: string[] = [];
    
    // Remove duplicative content
    for (const sentence of sentences) {
      const normalized = sentence.trim().toLowerCase();
      let isDuplicate = false;
      
      for (const existing of uniqueSentences) {
        if (calculateStringSimilarity(normalized, existing.toLowerCase()) > 0.7) {
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate) {
        uniqueSentences.push(sentence.trim());
      }
    }
    
    return uniqueSentences.join(". ") + ".";
  }
  
  return responseText;
};

// Import the similarity calculation function
import { calculateStringSimilarity } from './similarity-utils';
