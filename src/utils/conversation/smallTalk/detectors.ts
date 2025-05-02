
/**
 * Detection utilities for small talk conversations
 * 
 * Contains functions to detect various aspects of conversation flow,
 * such as overstimulation, appropriateness of small talk, etc.
 */

/**
 * Social overstimulation detection - signs that the person might need
 * a break from conversation based on autism research materials
 */
export const detectSocialOverstimulation = (userInput: string): boolean => {
  const overStimulationSignals = [
    /too (much|many) questions/i,
    /need (a break|space|quiet)/i,
    /overwhelm(ing|ed)/i,
    /stop (talking|asking)/i,
    /too (loud|noisy)/i,
    /sensory/i,
    /(can't|cannot) focus/i,
    /too much (going on|information)/i,
    /need silence/i,
    /prefer not to talk/i,
    /don't (want|feel like) (talking|chatting)/i
  ];
  
  return overStimulationSignals.some(pattern => pattern.test(userInput));
};

/**
 * Detects if a user message indicates a need for small talk
 * @param userInput User's message
 * @param messageCount Current message count in the conversation
 * @returns Whether small talk would be appropriate
 */
export const shouldUseSmallTalk = (
  userInput: string,
  messageCount: number,
  previousMessages: string[] = []
): boolean => {
  // Always consider small talk in the first 10 messages
  if (messageCount <= 10) {
    return true;
  }
  
  // Check if the user's message is brief or contains small talk indicators
  const smallTalkIndicators = [
    /how are you/i,
    /what's up/i,
    /nice (day|weather)/i,
    /how('s| is) it going/i,
    /what('s| is) new/i,
    /been up to/i,
    /what do you (like|enjoy)/i,
    /tell me about yourself/i,
    /just waiting/i,
    /waiting for/i,
    /bored/i,
    /quiet in here/i,
    /how long/i,
    // Cleveland-specific indicators
    /Cleveland/i,
    /Browns|Cavaliers|Cavs|Guardians/i,
    /Lake Erie/i,
    /West Side Market/i,
    /Metroparks/i,
    /Rock Hall|Rock and Roll/i
  ];
  
  // Check if the user's message is brief (likely small talk)
  const words = userInput.trim().split(/\s+/);
  const isBrief = words.length <= 7;
  
  // If the message is brief or contains small talk indicators
  if (isBrief || smallTalkIndicators.some(pattern => pattern.test(userInput))) {
    return true;
  }
  
  // Check for lulls in conversation - if last few messages were also brief
  if (previousMessages.length >= 2) {
    const recentMessagesAreBrief = previousMessages
      .slice(-2)
      .every(msg => msg.trim().split(/\s+/).length <= 7);
      
    if (recentMessagesAreBrief) {
      return true;
    }
  }
  
  return false;
};

/**
 * Checks if user's message is likely related to waiting for their appointment
 */
export const isWaitingRoomRelated = (userInput: string): boolean => {
  const waitingPatterns = [
    /wait(ing)?/i,
    /how long/i,
    /when (will|is) (he|eric|the (doctor|therapist))/i,
    /appointment/i,
    /schedule/i,
    /late/i,
    /taking (forever|so long)/i,
    /what time/i,
    /still with (another|previous|other) (patient|person)/i,
    /ready for me/i,
    /check (if|when)/i,
    /coming (out|soon)/i
  ];
  
  return waitingPatterns.some(pattern => pattern.test(userInput));
};
