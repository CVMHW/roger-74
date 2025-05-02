
import { WorkdayContext, getCurrentWorkdayContext } from './workdayContext';

/**
 * Generate responses specifically for work stress situations
 */
export const generateWorkStressResponse = (
  userInput: string,
  stressLevel: 'low' | 'moderate' | 'high',
  mentions: {
    boss?: boolean;
    coworkers?: boolean;
    yelling?: boolean;
    deadline?: boolean;
    overtime?: boolean;
  }
): string => {
  const context = getCurrentWorkdayContext();
  
  // For high stress with boss yelling
  if (stressLevel === 'high' && mentions.boss && mentions.yelling) {
    return generateBossYellingResponse(context);
  }
  
  // For deadline stress
  if (mentions.deadline) {
    return generateDeadlineStressResponse(context);
  }
  
  // For overtime stress
  if (mentions.overtime) {
    return generateOvertimeStressResponse(context);
  }
  
  // For coworker stress
  if (mentions.coworkers) {
    return generateCoworkerStressResponse(context);
  }
  
  // For general work stress
  return generateGeneralWorkStressResponse(context, stressLevel);
};

/**
 * Response for when boss is yelling
 */
const generateBossYellingResponse = (context: WorkdayContext): string => {
  const responses = [
    "That sounds really tough. Being yelled at by your boss can feel demeaning and stressful. How are you coping with that situation?",
    "Being yelled at by your boss is never okay. That kind of treatment can really wear you down. How are you holding up?",
    "I hear you. Having a boss who yells can make even good jobs feel unbearable. What's your usual way of dealing with this?",
    "That's rough. Nobody deserves to be yelled at in the workplace. How long has this been going on?"
  ];
  
  // Add weekend context if it's end of week
  if (context.isEndOfWeek) {
    const weekendAdditions = [
      " At least the weekend is almost here so you can get a break from it.",
      " The good news is you'll have the weekend to recharge after today.",
      " I hope the weekend gives you some space from that environment."
    ];
    
    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    return baseResponse + weekendAdditions[Math.floor(Math.random() * weekendAdditions.length)];
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Response for deadline stress
 */
const generateDeadlineStressResponse = (context: WorkdayContext): string => {
  const responses = [
    "Deadlines can create a lot of pressure. How are you managing the workload?",
    "Having tight deadlines can be really stressful. What's your approach to getting through them?",
    "Meeting deadlines can be tough, especially when there's a lot riding on them. How are you handling the pressure?",
    "Those work deadlines can really weigh on you. What's your strategy for dealing with them?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Response for overtime stress
 */
const generateOvertimeStressResponse = (context: WorkdayContext): string => {
  const responses = [
    "Working overtime can be exhausting - it cuts into your personal time and recovery. How's that affecting you?",
    "Those long hours can really drain you. Are you getting any time to rest and recharge?",
    "Having to put in extra hours can be tough on your wellbeing. How are you taking care of yourself during this busy time?",
    "Working beyond your normal hours can be hard to sustain. How much longer do you think this will go on?"
  ];
  
  // Add specific context for end of day
  if (context.isEndOfWorkday) {
    const endDayAdditions = [
      " Hopefully you can head home soon and get some rest.",
      " At least today's shift is almost over.",
      " I hope you're nearly done for today."
    ];
    
    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    return baseResponse + endDayAdditions[Math.floor(Math.random() * endDayAdditions.length)];
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Response for coworker stress
 */
const generateCoworkerStressResponse = (context: WorkdayContext): string => {
  const responses = [
    "Difficult coworkers can make the workday so much harder. What's been going on with your team?",
    "Team dynamics can really impact how we feel at work. What's happening with your coworkers that's causing stress?",
    "Workplace relationships can be complicated. What's been challenging about the people you work with?",
    "Having issues with coworkers can make going to work tough. What's been happening?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Response for general work stress
 */
const generateGeneralWorkStressResponse = (context: WorkdayContext, stressLevel: 'low' | 'moderate' | 'high'): string => {
  let responses: string[];
  
  if (stressLevel === 'high') {
    responses = [
      "Work stress can be really overwhelming sometimes. What's been the hardest part for you lately?",
      "It sounds like work has been especially difficult this week. What's been making it so tough?",
      "When work gets that stressful, it can affect everything else. How's it been impacting you outside of work?",
      "That level of work stress is real and valid. What do you find helps you cope with it?"
    ];
  } else {
    responses = [
      "Work can definitely be stressful sometimes. What's been on your mind about it?",
      "Sorry to hear work's been challenging. What aspects have been most difficult?",
      "Work stress can really add up over time. What's been going on there?",
      "Jobs can throw a lot at us sometimes. What's been happening at work?"
    ];
  }
  
  // Add weekend context if it's end of week
  if (context.isEndOfWeek) {
    const weekendAdditions = [
      " At least the weekend is coming up soon.",
      " Only a little while left until the weekend.",
      " The weekend's just around the corner for a break."
    ];
    
    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    return baseResponse + weekendAdditions[Math.floor(Math.random() * weekendAdditions.length)];
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
};
