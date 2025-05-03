
/**
 * Logotherapy approach detection utilities
 */

/**
 * Detect which logotherapy approach might be most relevant based on user input
 */
export const detectLogotherapyApproach = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Import necessary functions
  const { getCulturalContext, getAgeAppropriateContext } = require('./utils/contextDetection');
  
  // Check for existential vacuum indicators
  if (lowerInput.includes('empty') || 
      lowerInput.includes('pointless') || 
      lowerInput.includes('no purpose') || 
      lowerInput.includes('meaningless') ||
      lowerInput.includes('what\'s the point')) {
    return 'existentialVacuum';
  }
  
  // Check for anxiety/fear indicators for paradoxical intention
  if (lowerInput.includes('anxious') || 
      lowerInput.includes('anxiety') || 
      lowerInput.includes('afraid') || 
      lowerInput.includes('fear') ||
      lowerInput.includes('panic') ||
      lowerInput.includes('insomnia')) {
    return 'paradoxicalIntention';
  }
  
  // Check for creative values (work, contribution)
  if (lowerInput.includes('work') || 
      lowerInput.includes('create') || 
      lowerInput.includes('make') || 
      lowerInput.includes('build') ||
      lowerInput.includes('contribute') ||
      lowerInput.includes('accomplish')) {
    return 'creativeValues';
  }
  
  // Check for experiential values (relationships, experiences)
  if (lowerInput.includes('love') || 
      lowerInput.includes('relationship') || 
      lowerInput.includes('experience') || 
      lowerInput.includes('feel') ||
      lowerInput.includes('connection') ||
      lowerInput.includes('beauty')) {
    return 'experientialValues';
  }
  
  // Check for attitudinal values (facing suffering)
  if (lowerInput.includes('suffer') || 
      lowerInput.includes('pain') || 
      lowerInput.includes('difficult') || 
      lowerInput.includes('challenge') ||
      lowerInput.includes('struggle') ||
      lowerInput.includes('attitude')) {
    return 'attitudinalValues';
  }
  
  // Add cultural and age-specific indicators
  const culturalContext = getCulturalContext(userInput);
  const ageContext = getAgeAppropriateContext(userInput);
  
  // Adjust approach based on cultural and age contexts if strongly indicated
  if (culturalContext === 'collectivist' && 
      (lowerInput.includes('family') || lowerInput.includes('community') || lowerInput.includes('tradition'))) {
    return 'creativeValues'; // Often emphasizes contribution to community
  }
  
  if (culturalContext === 'spiritual' && 
      (lowerInput.includes('faith') || lowerInput.includes('belief') || lowerInput.includes('god'))) {
    return 'experientialValues'; // Often emphasizes transcendent experiences
  }
  
  if (ageContext === 'youth' || ageContext === 'teen') {
    return 'socraticDialogue'; // Often better for younger individuals
  }
  
  if (ageContext === 'elder' && 
      (lowerInput.includes('legacy') || lowerInput.includes('wisdom') || lowerInput.includes('life story'))) {
    return 'attitudinalValues'; // Often relevant for life review
  }
  
  // Default to Socratic approach for exploration
  return 'socraticDialogue';
};
