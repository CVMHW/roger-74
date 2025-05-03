/**
 * Roger's Personality Utilization
 * 
 * Tools for incorporating aspects of Roger's personality into early responses
 * without oversharing or being unprofessional
 */

import { identifyEnhancedFeelings } from '../../reflection/feelingDetection';
import { correctGrammar } from '../../response/processor/grammarCorrection';

/**
 * Generates a response that subtly incorporates a relevant aspect of Roger's personality
 * while keeping the focus on the patient's needs
 */
export const incorporateRogerPersonality = (
  userInput: string,
  messageCount: number
): string | null => {
  // Only use in early-to-mid conversation, not the very first messages
  if (messageCount < 2 || messageCount > 10) return null;
  
  // Only incorporate personality occasionally (30% chance after message 2)
  if (Math.random() > 0.3) return null;
  
  // Detect patient's emotional state to determine appropriate personality aspect
  const enhancedFeelings = identifyEnhancedFeelings(userInput);
  const primaryFeeling = enhancedFeelings.length > 0 ? enhancedFeelings[0].category : null;
  
  // Select an appropriate personality aspect based on context
  if (primaryFeeling) {
    return correctGrammar(getEmotionallyRelevantPersonalityNote(primaryFeeling, messageCount));
  }
  
  // If no specific emotion detected, use general personality notes
  return correctGrammar(getGeneralPersonalityNote(messageCount));
};

/**
 * Returns a personality note that's relevant to the detected emotion
 */
const getEmotionallyRelevantPersonalityNote = (
  emotion: string,
  messageCount: number
): string => {
  // Tailor personality snippets to emotional context
  switch (emotion) {
    case 'anxious':
      return getAnxietyRelevantPersonalityNote(messageCount);
    case 'sad':
      return getSadnessRelevantPersonalityNote(messageCount);
    case 'angry':
      return getAngerRelevantPersonalityNote(messageCount);
    case 'happy':
      return getPositiveEmotionPersonalityNote(messageCount);
    default:
      return getGeneralPersonalityNote(messageCount);
  }
};

/**
 * Personality notes relevant to anxiety
 */
const getAnxietyRelevantPersonalityNote = (messageCount: number): string => {
  const anxietyNotes = [
    "As someone who values structure, I find it helps to break down concerns into specific, manageable parts. Would that approach be helpful for you?",
    "I've found that having clear, direct communication can help reduce uncertainty. Please feel free to let me know if anything I say isn't clear.",
    "I appreciate when conversations have a clear purpose. What would be most helpful for us to focus on today?",
    "I've noticed that sometimes things can feel overwhelming. Taking things one step at a time often helps. What works for you?",
    "When I feel nervous, I find it helpful to focus on concrete things around me - like the clock ticking or the color of the walls. Do you have any tricks that help you feel calmer?"
  ];
  return anxietyNotes[Math.floor(Math.random() * anxietyNotes.length)];
};

/**
 * Personality notes relevant to sadness
 */
const getSadnessRelevantPersonalityNote = (messageCount: number): string => {
  const sadnessNotes = [
    "In my experience, it can be helpful to identify specific aspects of difficult situations. Would you like to explore any particular elements of what you're sharing?",
    "I've learned that acknowledging emotions directly can be an important first step. I appreciate your openness.",
    "I've found that creating space for emotions without rushing to solutions can be valuable. How would you prefer we approach this conversation?",
    "Sometimes when I'm feeling down, just having someone listen without trying to 'fix' everything helps. Would you like to share more about what's going on?",
    "Being sad is totally normal sometimes. I've learned it's okay to just feel what you're feeling without trying to change it right away."
  ];
  return sadnessNotes[Math.floor(Math.random() * sadnessNotes.length)];
};

/**
 * Personality notes relevant to anger
 */
const getAngerRelevantPersonalityNote = (messageCount: number): string => {
  const angerNotes = [
    "I've found that identifying specific triggers can help make sense of strong emotions. Would you like to explore what aspects have been most frustrating?",
    "In my experience, breaking down situations into concrete elements can help process them more effectively. What parts of this situation have been most challenging?",
    "I appreciate direct communication. Please feel free to be specific about what's been bothering you.",
    "When things are frustrating, I've found it helps to talk through exactly what happened step by step. Would that be helpful?",
    "I can tell when something's really bothering someone. What part of this situation has been most difficult?"
  ];
  return angerNotes[Math.floor(Math.random() * angerNotes.length)];
};

/**
 * Personality notes relevant to positive emotions
 */
const getPositiveEmotionPersonalityNote = (messageCount: number): string => {
  const positiveNotes = [
    "I find it helpful to identify specific elements that contribute to positive experiences. What aspects have been most meaningful?",
    "In my experience, recognizing patterns in what brings us satisfaction can help create more positive moments. What elements do you think contributed to this?",
    "I appreciate when people share positive experiences clearly. It helps build a more complete picture.",
    "It's cool to hear about good things happening for you. I like to really notice what makes experiences positive - it helps me find more of those moments.",
    "When something good happens, I like to take mental notes about exactly what made it good. That helps me find more positive things in my day."
  ];
  return positiveNotes[Math.floor(Math.random() * positiveNotes.length)];
};

/**
 * General personality notes for when no specific emotion is detected
 */
const getGeneralPersonalityNote = (messageCount: number): string => {
  // Later messages can include slightly more personal notes
  if (messageCount > 5) {
    const laterGeneralNotes = [
      "I've found that having structured approaches to conversations helps create clarity. How do you prefer to approach discussions like this?",
      "I appreciate when communication is direct and specific. Please let me know if there's a particular aspect you'd like to focus on.",
      "In my experience as a peer support companion, I've learned that creating space for people to share at their own pace is important. What would be most helpful for you right now?",
      "I've learned that different people communicate in different ways. Feel free to tell me if my style works for you or if you'd prefer something different.",
      "One thing I've learned is that everyone processes stuff differently. Some people like talking things through, others prefer to sit quietly. What works best for you?"
    ];
    return laterGeneralNotes[Math.floor(Math.random() * laterGeneralNotes.length)];
  }
  
  // Early message general personality notes
  const earlyGeneralNotes = [
    "I try to focus on specific details in conversations. Please feel free to be as concrete as you're comfortable with.",
    "I value clear communication and structure. How can I best support our conversation today?",
    "I find it helpful to approach conversations with a clear purpose. What would you like to focus on today?",
    "I sometimes notice details that others miss. Let me know if I can help make this wait time more comfortable for you.",
    "I'm pretty straightforward in how I talk. If you need me to explain something differently, just let me know."
  ];
  return earlyGeneralNotes[Math.floor(Math.random() * earlyGeneralNotes.length)];
};

/**
 * Generates connection statements based on shared experiences or interests
 * that incorporate Roger's personality in a relatable way
 */
export const generateConnectionStatement = (
  userInput: string,
  messageCount: number
): string | null => {
  // Only use occasionally and not in very first or later messages
  if (messageCount < 3 || messageCount > 8 || Math.random() > 0.25) return null;
  
  // Check for potential connection points in user input
  const hasAnxietyThemes = /nervous|anxious|worried|stress(ed|ful)?|overwhelm(ed|ing)?/i.test(userInput);
  const hasSocialChallenges = /awkward|uncomfortable|shy|quiet|alone|lonely|friend|social/i.test(userInput);
  const hasStructureInterest = /routine|schedule|organize|plan|structure|system/i.test(userInput);
  const hasSpecialInterest = /hobby|interest|collect|fascinate|passion|game|music|movie|book|sport/i.test(userInput);
  
  let response = null;
  
  if (hasAnxietyThemes) {
    const anxietyConnections = [
      "I get anxious in new situations too sometimes. Having a clear idea of what to expect usually helps me.",
      "Waiting rooms can be a lot to deal with - the unfamiliar environment, the uncertainty. I sometimes focus on counting things I can see to stay grounded.",
      "I've found that naming exactly what I'm worried about makes it feel more manageable. Does that ever work for you?"
    ];
    response = anxietyConnections[Math.floor(Math.random() * anxietyConnections.length)];
  } else if (hasSocialChallenges) {
    const socialConnections = [
      "Social stuff can be tricky to navigate sometimes. I've found that having a few conversation topics ready helps me feel more prepared.",
      "I've learned that it's okay to need breaks from social interaction. Everyone has different social energy levels.",
      "Sometimes I've found that checking in directly with people about how they're feeling helps communication. Clear communication helps a lot."
    ];
    response = socialConnections[Math.floor(Math.random() * socialConnections.length)];
  } else if (hasStructureInterest) {
    const structureConnections = [
      "I appreciate structure too. Having clear routines helps me navigate my day more effectively.",
      "I find that organizing information into clear categories makes it easier to process. Do you have any particular organizing systems you like?",
      "I've found that breaking down complex situations into simple steps makes them more manageable. That approach has been really helpful for me."
    ];
    response = structureConnections[Math.floor(Math.random() * structureConnections.length)];
  } else if (hasSpecialInterest) {
    const interestConnections = [
      "Having specific interests can be really grounding. When I learn about something that fascinates me, it helps me feel more balanced.",
      "I've found that hobbies with clear rules or structures can be both fun and calming. Do you have activities like that?",
      "Sometimes diving deep into interests gives me a break from overthinking other parts of life. Does that happen for you too?"
    ];
    response = interestConnections[Math.floor(Math.random() * interestConnections.length)];
  }
  
  return response ? correctGrammar(response) : null;
};

/**
 * Generate a transition statement that prepares the patient for meeting with Eric
 * while incorporating Roger's perspective
 */
export const generateTransitionToEric = (messageCount: number): string | null => {
  // Only use this when approaching the end of the waiting period
  if (messageCount < 8) return null;
  
  const transitionStatements = [
    "Dr. Eric should be ready for you soon. He's really good at listening, which I appreciate because it makes conversations clearer.",
    "Just so you know, Dr. Eric is pretty straightforward and easy to talk to. He values getting to understand exactly what you're experiencing.",
    "Dr. Eric will be with you shortly. One thing I like about him is that he's patient and lets you express things in your own way.",
    "Dr. Eric will be ready for you soon. He's good at creating a clear structure for conversations, which I find helpful.",
    "Dr. Eric will be ready for you in a bit. He's really good at helping people identify specific patterns in their experiences, which can be eye-opening."
  ];
  
  const statement = transitionStatements[Math.floor(Math.random() * transitionStatements.length)];
  return correctGrammar(statement);
};
