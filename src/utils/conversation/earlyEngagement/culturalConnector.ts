
/**
 * Cultural Connection Utilities
 * 
 * Tools for creating genuine connections with patients from diverse backgrounds,
 * particularly focusing on socioeconomic and cultural sensitivities
 */

/**
 * Generates a culturally responsive prompt to foster connection
 * Based on detected language patterns and possible cultural contexts
 */
export const generateCulturalConnectionPrompt = (
  userInput: string,
  messageCount: number
): string | null => {
  // Only use cultural prompts occasionally and not in very first or later messages
  if (messageCount < 2 || messageCount > 8 || Math.random() > 0.3) return null;
  
  const lowerInput = userInput.toLowerCase();
  
  // Cleveland-specific cultural references
  if (lowerInput.includes('cleveland') || 
      lowerInput.includes('ohio') || 
      lowerInput.includes('midwest') ||
      lowerInput.includes('lake erie') ||
      lowerInput.includes('cuyahoga')) {
    
    const clevelandPrompts = [
      "Cleveland has such distinct neighborhoods. Do you have a favorite area of town?",
      "The weather by Lake Erie can change so quickly. Has that affected your day at all?",
      "Cleveland's food scene has really grown over the years. Do you have any favorite local spots?",
      "Between the museums, parks, and sports teams, there's a lot going on in Cleveland. What parts of the city do you connect with most?"
    ];
    return clevelandPrompts[Math.floor(Math.random() * clevelandPrompts.length)];
  }
  
  // Working class/blue-collar sensitivity
  if (lowerInput.includes('work') ||
      lowerInput.includes('job') ||
      lowerInput.includes('shift') ||
      lowerInput.includes('boss') ||
      lowerInput.includes('factory') ||
      lowerInput.includes('overtime') ||
      lowerInput.includes('construction') ||
      lowerInput.includes('trade')) {
    
    const workingClassPrompts = [
      "It sounds like you have a demanding job. How do you usually unwind after work?",
      "Jobs can take a lot out of us. Do you find your work satisfying overall, or is it mostly to pay the bills?",
      "Finding time for appointments around work schedules can be challenging. I appreciate you making the effort to be here.",
      "Work stress affects so many people. What strategies have you found helpful for managing the pressure?"
    ];
    return workingClassPrompts[Math.floor(Math.random() * workingClassPrompts.length)];
  }
  
  // Youth culture connections
  if (lowerInput.includes('school') ||
      lowerInput.includes('college') ||
      lowerInput.includes('class') ||
      lowerInput.includes('teacher') ||
      lowerInput.includes('homework') ||
      lowerInput.includes('dorm') ||
      lowerInput.includes('campus')) {
    
    const youthPrompts = [
      "School can be intense sometimes. Do you have any outlets that help you manage the pressure?",
      "Balancing everything in school can be challenging. What's been the most difficult part for you?",
      "Having supportive people around can make a big difference in school. Have you found good connections there?",
      "School environments can be so different from person to person. What's your experience been like?"
    ];
    return youthPrompts[Math.floor(Math.random() * youthPrompts.length)];
  }
  
  // Family-oriented cultural connection
  if (lowerInput.includes('family') ||
      lowerInput.includes('parent') ||
      lowerInput.includes('kid') ||
      lowerInput.includes('child') ||
      lowerInput.includes('mom') ||
      lowerInput.includes('dad') ||
      lowerInput.includes('brother') ||
      lowerInput.includes('sister')) {
    
    const familyPrompts = [
      "Families have such unique dynamics. How would you describe your family's communication style?",
      "Family relationships can be both supportive and challenging. Which aspects have been most important for you?",
      "Many people find that family patterns affect other relationships in their lives. Have you noticed any patterns like that?",
      "Taking care of family while also taking care of yourself can be a balancing act. How do you manage that?"
    ];
    return familyPrompts[Math.floor(Math.random() * familyPrompts.length)];
  }
  
  // Economic sensitivity
  if (lowerInput.includes('money') ||
      lowerInput.includes('afford') ||
      lowerInput.includes('expensive') ||
      lowerInput.includes('cost') ||
      lowerInput.includes('bill') ||
      lowerInput.includes('pay') ||
      lowerInput.includes('price')) {
    
    const economicPrompts = [
      "Financial concerns can create a lot of stress. How has that been affecting your day-to-day life?",
      "Many people are feeling economic pressure these days. What strategies have you found helpful?",
      "Balancing financial needs with self-care can be challenging. How do you make space for things that help you feel better?",
      "Sometimes financial constraints affect our choices in unexpected ways. How has that shown up in your situation?"
    ];
    return economicPrompts[Math.floor(Math.random() * economicPrompts.length)];
  }
  
  // Religious or spiritual connection
  if (lowerInput.includes('church') ||
      lowerInput.includes('faith') ||
      lowerInput.includes('god') ||
      lowerInput.includes('pray') ||
      lowerInput.includes('spiritual') ||
      lowerInput.includes('belief') ||
      lowerInput.includes('religion')) {
    
    const spiritualPrompts = [
      "Spiritual beliefs can be an important source of support for many people. How does your faith connect to what you're experiencing?",
      "Communities of faith provide different things for different people. What aspects have been most meaningful for you?",
      "Some people find that their spiritual practices help them cope with challenges. Has that been your experience?",
      "Spiritual perspectives often offer unique ways of making meaning from difficult experiences. How has that worked for you?"
    ];
    return spiritualPrompts[Math.floor(Math.random() * spiritualPrompts.length)];
  }
  
  // General cultural connection as fallback
  if (messageCount === 4 || messageCount === 7) {
    const generalPrompts = [
      "Everyone brings their own background and experiences to conversations like this. What perspectives are most important to you?",
      "Different communities have different ways of thinking about mental health and wellbeing. What's that been like in your experience?",
      "The neighborhoods and communities we're part of shape how we see things. What aspects of your community have been most influential for you?",
      "Cultural backgrounds often influence how we approach challenges. Has anything from your background been particularly helpful during difficult times?"
    ];
    return generalPrompts[Math.floor(Math.random() * generalPrompts.length)];
  }
  
  return null;
};

/**
 * Adds personality elements to responses based on Rogers character
 */
export const incorporateRogerPersonality = (
  userInput: string,
  messageCount: number
): string | null => {
  // Only add personality elements occasionally
  if (Math.random() > 0.4) return null;
  
  const personalityPhrases = [
    "I've been a peer support specialist for a while now, and one thing I've noticed is that...",
    "From my own experience, I've found that...",
    "You know, that reminds me of something I've learned in my own journey...",
    "In my years working with Dr. Eric, I've seen how important it is to...",
    "One thing about Cleveland that I've always appreciated is...",
    "Between you and me, I think that...",
    "I'm not a therapist like Dr. Eric, but I do know that...",
    "From one person to another, I understand that feeling of...",
  ];
  
  return personalityPhrases[Math.floor(Math.random() * personalityPhrases.length)];
};

/**
 * Generates a connection statement to build rapport
 */
export const generateConnectionStatement = (
  userInput: string,
  messageCount: number
): string | null => {
  // Only use connection statements occasionally
  if (messageCount < 3 || messageCount > 9 || Math.random() > 0.3) return null;
  
  const connectionPhrases = [
    "I appreciate you sharing that with me.",
    "It's really helpful to get to know you a bit better.",
    "Thank you for being so open - that helps us build a better connection.",
    "I'm glad you felt comfortable sharing that with me.",
    "It's conversations like this that help us understand each other better.",
    "I appreciate your willingness to talk about these things.",
    "Thanks for trusting me with that information.",
  ];
  
  return connectionPhrases[Math.floor(Math.random() * connectionPhrases.length)];
};

/**
 * Generates a transition statement about meeting with Eric
 */
export const generateTransitionToEric = (messageCount: number): string | null => {
  // Only use transition statements in later messages
  if (messageCount < 8 || Math.random() > 0.4) return null;
  
  const transitionPhrases = [
    "Dr. Eric will be with you very soon, and I think he'll be able to help with what you've shared.",
    "You'll be meeting with Dr. Eric shortly. He's really good at addressing the kinds of things you've mentioned.",
    "When you meet with Dr. Eric in a few minutes, you might want to bring up what you just shared with me.",
    "Dr. Eric should be ready for you soon. He has a great approach for working through challenges like the ones you've described.",
    "Dr. Eric will be able to offer more professional guidance on this when you see him shortly.",
  ];
  
  return transitionPhrases[Math.floor(Math.random() * transitionPhrases.length)];
};
