
/**
 * Roger's Personality Utilization
 * 
 * Tools for incorporating aspects of Roger's personality into early responses
 * without oversharing or being unprofessional
 */

import { identifyEnhancedFeelings } from '../../reflection/feelingDetection';

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
    return getEmotionallyRelevantPersonalityNote(primaryFeeling, messageCount);
  }
  
  // If no specific emotion detected, use general personality notes
  return getGeneralPersonalityNote(messageCount);
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
    "I appreciate when conversations have a clear purpose. What would be most helpful for us to focus on today?"
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
    "I've found that creating space for emotions without rushing to solutions can be valuable. How would you prefer we approach this conversation?"
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
    "I appreciate direct communication. Please feel free to be specific about what's been bothering you."
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
    "I appreciate when people share positive experiences clearly. It helps build a more complete picture."
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
      "In my experience as a peer support companion, I've learned that creating space for people to share at their own pace is important. What would be most helpful for you right now?"
    ];
    return laterGeneralNotes[Math.floor(Math.random() * laterGeneralNotes.length)];
  }
  
  // Early message general personality notes
  const earlyGeneralNotes = [
    "I try to focus on specific details in conversations. Please feel free to be as concrete as you're comfortable with.",
    "I value clear communication and structure. How can I best support our conversation today?",
    "I find it helpful to approach conversations with a clear purpose. What would you like to focus on today?"
  ];
  return earlyGeneralNotes[Math.floor(Math.random() * earlyGeneralNotes.length)];
};
