
/**
 * Creates a response for weather-related situations like extreme snow, storms, etc.
 * @param userInput The user's message about weather challenges
 * @returns A reflective response that acknowledges the user's situation
 */
export const createWeatherRelatedResponse = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Extract keywords related to specific weather conditions
  const hasSnow = /snow|blizzard|ice storm|winter/i.test(lowerInput);
  const hasFlood = /flood|rain|water|hurricane/i.test(lowerInput);
  const hasHeat = /heat wave|heat|hot|temperature|humid/i.test(lowerInput);
  const hasStorm = /storm|tornado|hurricane|typhoon|wind|thunderstorm/i.test(lowerInput);
  const hasPower = /power|electricity|outage|internet|connection|service/i.test(lowerInput);
  
  // Match specific weather challenges
  if (hasSnow) {
    return `Being stuck indoors during heavy snow can be really challenging. It's natural to feel a bit stir-crazy when you can't go about your normal routine. How have you been managing to pass the time while you're confined to your home?`;
  } else if (hasFlood) {
    return `Flooding situations can be both frustrating and concerning. It's completely understandable to feel anxious when your mobility and normal routines are disrupted by water. How are you managing to take care of yourself during this difficult time?`;
  } else if (hasHeat) {
    return `Extreme heat can be physically and emotionally draining, especially when it lasts for multiple days. It's natural to feel irritable or low energy when dealing with high temperatures. What strategies have you found to stay comfortable?`;
  } else if (hasStorm) {
    return `Storm situations can create a lot of uncertainty and disruption to daily life. The combination of possible danger and practical challenges often leads to feelings of stress or anxiety. How are you coping with the situation right now?`;
  } else if (hasPower) {
    return `Power outages can be incredibly frustrating, especially when they affect your ability to work, communicate, or enjoy basic comforts. It's natural to feel disconnected and isolated when technology we rely on isn't available. How are you managing to adapt to these temporary limitations?`;
  }
  
  // Default response for general weather challenges
  return `Weather emergencies can be really disruptive to our routines and wellbeing. It's completely normal to feel frustrated, isolated, or down when your normal activities are limited by circumstances beyond your control. How have you been coping with these restrictions?`;
};
