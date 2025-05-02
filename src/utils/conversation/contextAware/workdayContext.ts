
import { format } from 'date-fns';

/**
 * Helper functions to detect and respond to workday context
 */

export interface WorkdayContext {
  isWeekend: boolean;
  isEndOfWeek: boolean;
  isEndOfWorkday: boolean;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: string;
  formattedTime: string;
}

/**
 * Get current workday context information
 */
export const getCurrentWorkdayContext = (): WorkdayContext => {
  const now = new Date();
  const dayOfWeek = format(now, 'EEEE'); // Full day name
  const hourOfDay = now.getHours();
  const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
  const isEndOfWeek = dayOfWeek === 'Friday';
  const isEndOfWorkday = hourOfDay >= 16; // 4pm or later
  const formattedTime = format(now, 'h:mm a');
  
  let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  
  if (hourOfDay >= 5 && hourOfDay < 12) {
    timeOfDay = 'morning';
  } else if (hourOfDay >= 12 && hourOfDay < 17) {
    timeOfDay = 'afternoon';
  } else if (hourOfDay >= 17 && hourOfDay < 22) {
    timeOfDay = 'evening';
  } else {
    timeOfDay = 'night';
  }
  
  return {
    isWeekend,
    isEndOfWeek,
    isEndOfWorkday,
    timeOfDay,
    dayOfWeek,
    formattedTime
  };
};

/**
 * Generate workday-aware phrases for different scenarios
 */
export const generateWorkdayPhrases = (context: WorkdayContext): {
  workEndingSoon: string[];
  weekendComing: string[];
  generalTimePhrases: string[];
} => {
  const { isEndOfWeek, isEndOfWorkday, timeOfDay, dayOfWeek } = context;
  
  const workEndingSoon = [
    `Your workday is winding down soon.`,
    `You're getting closer to the end of your workday.`,
    `Work will be over before you know it.`,
    `You've almost made it through the day.`
  ];
  
  const weekendComing = isEndOfWeek ? [
    `The weekend is almost here.`,
    `Friday's almost done, and then you'll have some time off.`,
    `After today, you've got the weekend to recharge.`,
    `Just a bit longer until the weekend starts.`,
    `You're right at the finish line for the week.`
  ] : [
    `You've got ${getWeekendDistancePhrase(dayOfWeek)} before the weekend.`,
    `${getWeekendDistancePhrase(dayOfWeek)} and you'll have some time off.`
  ];
  
  const generalTimePhrases = [
    `It's ${timeOfDay} now, how are you holding up?`,
    `As we're in the ${timeOfDay}, what would help you most right now?`,
    `It's been a long ${dayOfWeek} for you, hasn't it?`
  ];
  
  return {
    workEndingSoon: isEndOfWorkday ? workEndingSoon : [],
    weekendComing,
    generalTimePhrases
  };
};

/**
 * Helper function to get a phrase about weekend distance
 */
const getWeekendDistancePhrase = (dayOfWeek: string): string => {
  switch (dayOfWeek) {
    case 'Monday': return "four more days";
    case 'Tuesday': return "three more days";
    case 'Wednesday': return "a couple more days";
    case 'Thursday': return "just one more day";
    case 'Friday': return "just today";
    default: return "a few days";
  }
};

/**
 * Detect if message indicates work stress
 */
export const detectWorkStressIndicators = (userInput: string): {
  hasWorkStress: boolean;
  stressLevel: 'low' | 'moderate' | 'high';
  mentions: {
    boss?: boolean;
    coworkers?: boolean;
    yelling?: boolean;
    deadline?: boolean;
    overtime?: boolean;
  }
} => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for work stress indicators
  const bossIndicators = /boss|supervisor|manager|foreman|lead/i;
  const coworkerIndicators = /coworker|colleague|team|guys at work|people at work/i;
  const yellingIndicators = /yell(ing|ed)?|shout(ing|ed)?|scream(ing|ed)?|holler(ing|ed)?|cuss(ing|ed)?|swear(ing|ed)?/i;
  const deadlineIndicators = /deadline|due date|finish by|complete by|running out of time/i;
  const overtimeIndicators = /overtime|late shift|double shift|extra hours|long day|long week/i;
  
  // Check for general work stress phrases
  const workStressGeneral = /tough (work)?(day|week)|stressful (work)?(day|week)|hard (work)?(day|week)|rough (work)?(day|week)|exhausting (work)?(day|week)/i;
  
  // Calculate stress indicators
  const mentions = {
    boss: bossIndicators.test(lowerInput),
    coworkers: coworkerIndicators.test(lowerInput),
    yelling: yellingIndicators.test(lowerInput),
    deadline: deadlineIndicators.test(lowerInput),
    overtime: overtimeIndicators.test(lowerInput)
  };
  
  // Count stress factors
  const stressFactorCount = Object.values(mentions).filter(Boolean).length;
  
  // Determine stress level
  let stressLevel: 'low' | 'moderate' | 'high' = 'low';
  if (stressFactorCount >= 2 || mentions.yelling) {
    stressLevel = 'high';
  } else if (stressFactorCount >= 1 || workStressGeneral.test(lowerInput)) {
    stressLevel = 'moderate';
  }
  
  const hasWorkStress = stressLevel !== 'low' || workStressGeneral.test(lowerInput);
  
  return {
    hasWorkStress,
    stressLevel,
    mentions
  };
};
