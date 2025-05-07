
/**
 * Detects underlying meaning themes in user input
 * This helps differentiate between surface feelings and deeper meaning
 */

/**
 * Detects underlying meaning themes in user input
 * This helps differentiate between surface feelings and deeper meaning
 * @param userInput User's message
 * @returns Object with meaning themes and importance indicators
 */
export const detectMeaningThemes = (userInput: string): {
  hasMeaningTheme: boolean;
  themes: string[];
  conflictingValues?: string[];
  lifeValues?: string[];
} => {
  const lowerInput = userInput.toLowerCase();
  const meaningThemes = [];
  const conflictingValues = [];
  const lifeValues = [];
  
  // Detect themes related to balance and priorities
  if (/balance|priorit(y|ies)|juggl(e|ing)|difficult choice|hard to choose/i.test(userInput)) {
    meaningThemes.push("balancing priorities");
    
    // Detect specific conflicting priorities
    if (/work.*and.*(life|family|relationship|personal|home)/i.test(userInput) || 
        /(life|family|relationship|personal|home).*and.*work/i.test(userInput)) {
      conflictingValues.push("work-life balance");
    }
    
    if (/(want|desire|need).*but.*(should|have to|must|obligation|responsibility)/i.test(userInput) ||
        /(should|have to|must|obligation|responsibility).*but.*(want|desire|need)/i.test(userInput)) {
      conflictingValues.push("personal desires vs. responsibilities");
    }
  }
  
  // Detect themes related to purpose and fulfillment
  if (/purpose|meaning|fulfillment|significant|impact|worthwhile|pointless|matter/i.test(userInput)) {
    meaningThemes.push("seeking purpose");
    lifeValues.push("meaningful contribution");
  }
  
  // Detect themes related to connection and belonging
  if (/connect(ion|ed)|belong(ing)?|lonely|isolated|part of something|community|relationship/i.test(userInput)) {
    meaningThemes.push("seeking connection");
    lifeValues.push("meaningful relationships");
  }
  
  // Detect themes related to identity and self-worth
  if (/identity|who (I am|am I)|self-worth|value as a person|purpose|role|contribution/i.test(userInput)) {
    meaningThemes.push("questioning identity");
    lifeValues.push("sense of self");
  }
  
  // Detect themes related to desire for autonomy
  if (/control|choice|freedom|decision|autonomy|independence|rely on|depend(ent|ence)/i.test(userInput)) {
    meaningThemes.push("seeking autonomy");
    lifeValues.push("personal freedom");
  }
  
  // Detect themes related to achievement and competence
  if (/achieve|success|fail|accomplish|proud|disappointed|let down|let.*down|expectation/i.test(userInput)) {
    meaningThemes.push("striving for achievement");
    lifeValues.push("personal accomplishment");
  }
  
  // Detect themes related to values and moral concerns
  if (/right|wrong|should|fair|unfair|justice|moral|ethic|values|believe|principle/i.test(userInput)) {
    meaningThemes.push("aligning with values");
    lifeValues.push("integrity");
  }
  
  // Detect themes related to struggle
  if (/tough|difficult|hard|struggle|challenging|overwhelming|too much/i.test(userInput)) {
    meaningThemes.push("facing challenges");
  }
  
  // NEW: Detect experiential time patterns that often indicate deeper meaning
  // Brief statements about time periods often carry deep meaning implications
  if (/(terrible|awful|horrible|rough|bad|tough) (day|night|week|morning|evening)/i.test(userInput)) {
    meaningThemes.push("processing difficult experiences");
    lifeValues.push("finding meaning in hardship");
  }
  
  // NEW: Special handling for very brief statements
  // When a user provides a very brief statement, it often carries deeper meaning
  if (userInput.split(/\s+/).length <= 5 && 
      /(terrible|awful|horrible|rough|bad|tough|difficult)/i.test(userInput)) {
    meaningThemes.push("reflecting on challenges");
    lifeValues.push("resilience");
  }
  
  return {
    hasMeaningTheme: meaningThemes.length > 0,
    themes: meaningThemes,
    conflictingValues: conflictingValues.length > 0 ? conflictingValues : undefined,
    lifeValues: lifeValues.length > 0 ? lifeValues : undefined
  };
};
