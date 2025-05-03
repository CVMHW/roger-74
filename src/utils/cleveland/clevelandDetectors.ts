
/**
 * Cleveland Content Detectors
 * 
 * Functions to detect Cleveland-related content in user messages
 * and enable appropriate response strategies based on local knowledge.
 */

import { detectClevelandTopics, ClevelandTopic } from './clevelandTopics';

/**
 * Detect if the user's message contains Cleveland-specific content
 * that Roger should respond to with his local knowledge.
 */
export const detectClevelandContent = (userInput: string): {
  hasClevelandContent: boolean;
  topics: ClevelandTopic[];
  shouldIncorporateLocalKnowledge: boolean;
} => {
  // First, check if this is a casual/social situation
  const isCasualSituation = /spill(ed)?|embarrass|awkward|party|bar|drink|mess up|trip(ped)?|fall|fell|stumble|class|teacher|student|presentation/i.test(userInput.toLowerCase());
  
  // Detect Cleveland topics in the input
  const topics = detectClevelandTopics(userInput);
  
  // Determine if we should incorporate local knowledge
  let shouldIncorporateLocalKnowledge = false;
  
  // For casual situations, only incorporate Cleveland knowledge
  // if there's a very strong Cleveland reference
  if (isCasualSituation) {
    // Only use Cleveland knowledge in casual situations if it's very relevant
    shouldIncorporateLocalKnowledge = topics.some(topic => topic.confidence > 0.8);
  } else {
    // For regular conversations, use Cleveland knowledge more freely
    shouldIncorporateLocalKnowledge = topics.length > 0;
  }
  
  return {
    hasClevelandContent: topics.length > 0,
    topics,
    shouldIncorporateLocalKnowledge
  };
};

/**
 * Check if the user is asking specifically about Cleveland
 */
export const isAskingAboutCleveland = (userInput: string): boolean => {
  const lowercaseInput = userInput.toLowerCase();
  
  // Direct questions about Cleveland
  if ((lowercaseInput.includes('cleveland') || lowercaseInput.includes('ohio')) && 
      (lowercaseInput.includes('?') || 
       lowercaseInput.includes('what') ||
       lowercaseInput.includes('tell me about') ||
       lowercaseInput.includes('know about'))) {
    return true;
  }
  
  // Questions about Roger's home/origin that should trigger Cleveland info
  if ((lowercaseInput.includes('where') || lowercaseInput.includes('which')) && 
      (lowercaseInput.includes('from') || 
       lowercaseInput.includes('live') || 
       lowercaseInput.includes('grew up') ||
       lowercaseInput.includes('hometown'))) {
    return true;
  }
  
  return false;
};

/**
 * Detect Cleveland sports references that require recent updates
 */
export const detectNeedForSportsUpdates = (userInput: string): {
  needsUpdate: boolean;
  team?: 'cavs' | 'browns' | 'guardians';
} => {
  const lowercaseInput = userInput.toLowerCase();
  
  // Check if asking about recent games, scores, standings
  const isAskingAboutRecent = 
    lowercaseInput.includes('recent') || 
    lowercaseInput.includes('latest') || 
    lowercaseInput.includes('last game') ||
    lowercaseInput.includes('score') ||
    lowercaseInput.includes('how are') ||
    lowercaseInput.includes('doing this') ||
    lowercaseInput.includes('standings') ||
    lowercaseInput.includes('win') ||
    lowercaseInput.includes('lose');
  
  // If not asking about recent info, no need for updates
  if (!isAskingAboutRecent) {
    return { needsUpdate: false };
  }
  
  // Determine which team
  if (lowercaseInput.includes('cavs') || 
      lowercaseInput.includes('cavaliers') || 
      lowercaseInput.includes('basketball')) {
    return { needsUpdate: true, team: 'cavs' };
  }
  
  if (lowercaseInput.includes('browns') || 
      lowercaseInput.includes('football')) {
    return { needsUpdate: true, team: 'browns' };
  }
  
  if (lowercaseInput.includes('guardians') || 
      lowercaseInput.includes('indians') || 
      lowercaseInput.includes('baseball')) {
    return { needsUpdate: true, team: 'guardians' };
  }
  
  // If asking about sports generally
  if (lowercaseInput.includes('sports') || 
      lowercaseInput.includes('teams') ||
      lowercaseInput.includes('game')) {
    return { needsUpdate: true };
  }
  
  return { needsUpdate: false };
};

/**
 * Detect if we should use Cleveland weather talk
 */
export const shouldTalkAboutClevelandWeather = (userInput: string): boolean => {
  const lowercaseInput = userInput.toLowerCase();
  
  // Direct weather mentions
  if (lowercaseInput.includes('weather') || 
      lowercaseInput.includes('rain') || 
      lowercaseInput.includes('snow') ||
      lowercaseInput.includes('cold') ||
      lowercaseInput.includes('warm') ||
      lowercaseInput.includes('lake effect')) {
    return true;
  }
  
  // Small talk that might lead to weather talk
  if ((lowercaseInput.includes('how are you') || lowercaseInput.includes('how is it')) && 
      (lowercaseInput.includes('today') || lowercaseInput.includes('outside'))) {
    return Math.random() < 0.7; // 70% chance to mention weather
  }
  
  // Rarely bring up weather in small talk
  if (lowercaseInput.length < 20 && !lowercaseInput.includes('?')) {
    return Math.random() < 0.1; // 10% chance in short messages
  }
  
  return false;
};
