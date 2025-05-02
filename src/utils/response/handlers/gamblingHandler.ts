
/**
 * Creates a response for mild gambling concerns that emphasizes reflection rather than crisis response
 * @param userInput The user's message about gambling
 * @returns A reflective response that acknowledges the user's feelings without escalation
 */
export const createMildGamblingResponse = (userInput: string): string => {
  // Extract keywords related to sports teams and events if present
  const lowerInput = userInput.toLowerCase();
  
  // Import sports teams data if available
  let sportTeamsModule;
  try {
    // Dynamic import to avoid circular dependencies
    sportTeamsModule = require('../../reflection/sportsTeamsData');
  } catch (e) {
    console.log("Sports teams module not available");
  }
  
  // Look for sports teams mentions
  const allTeamNames = sportTeamsModule?.getAllTeamNamesAndAliases() || [];
  const mentionedTeamNames = allTeamNames.filter(team => lowerInput.includes(team));
  
  // Find the first mentioned team with details
  let teamInfo = null;
  if (mentionedTeamNames.length > 0) {
    teamInfo = sportTeamsModule?.findTeam(mentionedTeamNames[0]);
  }
  
  // Default team name if no specific team is found
  const team = teamInfo?.name || mentionedTeamNames[0] || 'favorite team';
  const sport = teamInfo?.sport || 'sports';
  
  // Look for emotion words
  const sadPattern = /sad|down|upset|disappointed|bummed/i;
  const frustrationPattern = /frustrat|annoy|irritat|bother/i;
  
  const hasSadness = sadPattern.test(lowerInput);
  const hasFrustration = frustrationPattern.test(lowerInput);
  
  // Check for money context
  const moneyMentioned = /[$]\d+|\d+ dollars|lost \d+|won \d+|bet \d+/i.test(lowerInput);
  
  // Check for Cleveland-specific references
  const clevelandMentioned = /cleveland|cle|the land/i.test(lowerInput);
  
  // Generate appropriate reflection based on context
  if (hasSadness && moneyMentioned && teamInfo) {
    return `I hear that you're feeling disappointed about losing your bet on the ${team}. That's a common experience when following ${sport}. Would you like to talk more about how this is affecting you?`;
  } else if (hasFrustration && moneyMentioned && teamInfo) {
    return `It sounds like you're frustrated about the money you lost betting on the ${team}. Even when it's not a huge amount, it can still feel disappointing. How are you handling that feeling?`;
  } else if (moneyMentioned && teamInfo) {
    return `I notice you mentioned losing some money on gambling related to the ${team}. Even small losses can impact our mood. How are you feeling about it now?`;
  } else if (clevelandMentioned && moneyMentioned) {
    return `I hear you talking about betting on Cleveland sports. The ups and downs of being a Cleveland sports fan can make betting particularly emotional. How does the outcome affect you beyond just the money involved?`;
  } else if (teamInfo) {
    return `I notice you mentioned ${team} in relation to betting. Following sports can be really engaging, especially when there's something at stake. How do you balance enjoying the game versus focusing on the bet?`;
  } else {
    return `I'm hearing that gambling is something you engage in occasionally. How do you feel about your experience with betting overall?`;
  }
};
