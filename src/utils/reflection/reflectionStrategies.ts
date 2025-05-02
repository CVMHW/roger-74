/**
 * Strategies for generating reflective responses based on user input
 */
import { DevelopmentalStage } from './reflectionTypes';

/**
 * Detects the likely developmental stage of the user based on language patterns
 * @param userInput The user's message text
 * @returns The detected developmental stage or undefined if uncertain
 */
export const detectDevelopmentalStage = (userInput: string): DevelopmentalStage | undefined => {
  if (!userInput) return undefined;
  
  const lowerInput = userInput.toLowerCase();
  
  // Detect infant/toddler language patterns (0-3)
  const infantPatterns = [
    'baby', 'toddler', 'diaper', 'potty', 'daycare', 'nap',
    'playtime', 'mommy', 'daddy', 'boo-boo', 'binky', 'paci',
    'bottle', 'sippy', 'crawling', 'walking', 'talk', 'words',
    'babbling', 'terrible twos', 'tantrum', '2 year old', '3 year old'
  ];
  
  // Detect young child language patterns (4-8)
  const youngChildPatterns = [
    'kindergarten', 'preschool', 'elementary school', 'recess', 'classroom',
    'teacher', 'homework', 'friends', 'playdate', 'playground',
    'cartoon', 'toy', 'game', 'bedtime', 'story', 'reading',
    'writing', 'drawing', 'coloring', 'abc', '123',
    '4 year old', '5 year old', '6 year old', '7 year old', '8 year old'
  ];
  
  // Detect middle childhood language patterns (9-12)
  const middleChildPatterns = [
    'middle school', 'junior high', 'video games', 'sports team',
    'best friend', 'sleepovers', 'allowance', 'bike ride',
    'cell phone', 'social media', 'youtube', 'minecraft', 'roblox',
    'fortnite', 'tiktok', 'puberty', 'changes',
    '9 year old', '10 year old', '11 year old', '12 year old'
  ];
  
  // Detect adolescent language patterns (13-17)
  const adolescentPatterns = [
    'high school', 'teenager', 'teen', 'dating', 'boyfriend', 'girlfriend',
    'crush', 'driver\'s license', 'driving', 'college applications',
    'sat', 'act', 'prom', 'homecoming', 'party', 'drinking',
    'smoking', 'vaping', 'independence', 'parents don\'t understand',
    'drama', 'cool', 'popular', 'instagram', 'snapchat', 'followers', 
    '13 year old', '14 year old', '15 year old', '16 year old', '17 year old'
  ];
  
  // Detect young adult language patterns (18-25)
  const youngAdultPatterns = [
    'college', 'university', 'dorm', 'roommate', 'major', 'degree',
    'internship', 'entry level', 'first job', 'apartment', 'dating app',
    'moving out', 'living on my own', 'student loans', 'budget',
    'career', 'grad school', 'rent', 'lease', 'bills', 'health insurance',
    '18 year old', '19 year old', '20 year old', 'early twenties', 'freshman', 'sophomore'
  ];
  
  // Count matches for each stage
  const infantMatches = infantPatterns.filter(pattern => lowerInput.includes(pattern)).length;
  const youngChildMatches = youngChildPatterns.filter(pattern => lowerInput.includes(pattern)).length;
  const middleChildMatches = middleChildPatterns.filter(pattern => lowerInput.includes(pattern)).length;
  const adolescentMatches = adolescentPatterns.filter(pattern => lowerInput.includes(pattern)).length;
  const youngAdultMatches = youngAdultPatterns.filter(pattern => lowerInput.includes(pattern)).length;
  
  // Determine the most likely stage based on match count
  const matchCounts = [
    { stage: 'infant_toddler' as DevelopmentalStage, count: infantMatches },
    { stage: 'young_child' as DevelopmentalStage, count: youngChildMatches },
    { stage: 'middle_childhood' as DevelopmentalStage, count: middleChildMatches },
    { stage: 'adolescent' as DevelopmentalStage, count: adolescentMatches },
    { stage: 'young_adult' as DevelopmentalStage, count: youngAdultMatches }
  ];
  
  // Sort by match count (descending)
  matchCounts.sort((a, b) => b.count - a.count);
  
  // Return the stage with the most matches, if it has at least 2 matches
  // Otherwise, default to adult
  return matchCounts[0].count >= 2 ? matchCounts[0].stage : 'adult';
};

/**
 * Generates a reflection response based on the user's developmental stage
 * @param userInput The user's message text
 * @param detectedStage The detected developmental stage
 * @returns A reflection response appropriate for the developmental stage
 */
export const generateDevelopmentallyAppropriateReflection = (
  userInput: string,
  detectedStage: DevelopmentalStage
): string => {
  // Adjust language complexity and tone based on developmental stage
  switch (detectedStage) {
    case 'infant_toddler':
      return generateSimpleReflection(userInput);
    case 'young_child':
      return generateChildFriendlyReflection(userInput);
    case 'middle_childhood':
      return generateMiddleChildhoodReflection(userInput);
    case 'adolescent':
      return generateAdolescentReflection(userInput);
    case 'young_adult':
      return generateYoungAdultReflection(userInput);
    default:
      return generateAdultReflection(userInput);
  }
};

/**
 * Generates a very simple reflection for very young children
 * Uses simple language, concrete concepts, and positive reinforcement
 */
const generateSimpleReflection = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for common toddler topics
  if (lowerInput.includes('mommy') || lowerInput.includes('daddy') || 
      lowerInput.includes('mom') || lowerInput.includes('dad')) {
    return "You're thinking about your mom and dad. They care about you a lot.";
  }
  
  if (lowerInput.includes('scared') || lowerInput.includes('afraid')) {
    return "It's okay to feel scared sometimes. Everyone feels scared sometimes.";
  }
  
  if (lowerInput.includes('sad')) {
    return "You feel sad right now. That's okay. Feelings come and go.";
  }
  
  if (lowerInput.includes('happy') || lowerInput.includes('fun')) {
    return "You're feeling happy! That's wonderful. I like hearing about what makes you happy.";
  }
  
  if (lowerInput.includes('angry') || lowerInput.includes('mad')) {
    return "You feel mad right now. Everyone feels mad sometimes. It's okay to talk about it.";
  }
  
  // Default simple reflection
  return "Thank you for sharing that with me. Would you like to tell me more?";
};

/**
 * Generates a child-friendly reflection for young children
 * Uses simple language but introduces more emotional concepts
 */
const generateChildFriendlyReflection = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for common child topics
  if (lowerInput.includes('school') || lowerInput.includes('teacher')) {
    return "School is a big part of your day. How do you feel when you're at school?";
  }
  
  if (lowerInput.includes('friend') || lowerInput.includes('play')) {
    return "Friends and playing are important to you. What do you enjoy doing with your friends?";
  }
  
  if (lowerInput.includes('scared') || lowerInput.includes('afraid') || lowerInput.includes('worry')) {
    return "It sounds like you're feeling worried about something. Everyone worries sometimes. Would you like to talk more about what's making you feel this way?";
  }
  
  if (lowerInput.includes('sad') || lowerInput.includes('cry')) {
    return "I hear that you're feeling sad. It's okay to feel sad sometimes. Would you like to share more about what's making you feel sad?";
  }
  
  if (lowerInput.includes('happy') || lowerInput.includes('fun') || lowerInput.includes('excited')) {
    return "It sounds like that makes you feel happy! I'd love to hear more about the things that bring you joy.";
  }
  
  // Default child-friendly reflection
  return "Thank you for sharing that with me. Your feelings are important. Would you like to tell me more?";
};

/**
 * Generates a reflection for middle childhood (9-12)
 * Introduces more complex emotional concepts and social dynamics
 */
const generateMiddleChildhoodReflection = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for common middle childhood topics
  if (lowerInput.includes('friend') || lowerInput.includes('best friend')) {
    return "Friendships seem important to you. Sometimes friendships can have ups and downs. How are you feeling about your friendships right now?";
  }
  
  if (lowerInput.includes('school') || lowerInput.includes('teacher') || lowerInput.includes('homework')) {
    return "School can bring up a lot of different feelings. It sounds like you're thinking about things happening at school. Would you like to share more about that?";
  }
  
  if (lowerInput.includes('parent') || lowerInput.includes('mom') || lowerInput.includes('dad')) {
    return "Family relationships can sometimes be complicated. It sounds like you're thinking about your family. How are things going at home?";
  }
  
  if (lowerInput.includes('video game') || lowerInput.includes('youtube') || lowerInput.includes('online')) {
    return "It sounds like you enjoy spending time online or playing games. What do you like most about that?";
  }
  
  // Default middle childhood reflection
  return "Thank you for sharing that with me. Your experiences and feelings matter. Would you like to tell me more about what's on your mind?";
};

/**
 * Generates a reflection for adolescents (13-17)
 * Acknowledges independence and identity formation
 */
const generateAdolescentReflection = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for common adolescent topics
  if (lowerInput.includes('parent') || lowerInput.includes('mom') || lowerInput.includes('dad') || 
      lowerInput.includes('family') || lowerInput.includes('rules')) {
    return "Navigating family relationships during teen years can be challenging. It sounds like you're thinking about your relationship with your family. Would you like to share more about what's happening?";
  }
  
  if (lowerInput.includes('friend') || lowerInput.includes('social') || 
      lowerInput.includes('group') || lowerInput.includes('popular')) {
    return "Social connections are really important during this time in your life. It sounds like you're thinking about your social relationships. How are you feeling about your friendships right now?";
  }
  
  if (lowerInput.includes('school') || lowerInput.includes('college') || 
      lowerInput.includes('future') || lowerInput.includes('career')) {
    return "Thinking about school and the future can bring up a lot of different feelings. It sounds like you're considering what's ahead for you. Would you like to talk more about your thoughts on this?";
  }
  
  if (lowerInput.includes('stress') || lowerInput.includes('pressure') || 
      lowerInput.includes('overwhelm') || lowerInput.includes('anxiety')) {
    return "The teen years often come with new pressures and stresses. It sounds like you're dealing with some challenging feelings right now. Would it help to talk more about what's causing these feelings?";
  }
  
  if (lowerInput.includes('identity') || lowerInput.includes('who I am') || 
      lowerInput.includes('figure out') || lowerInput.includes('confused about myself')) {
    return "Exploring who you are and who you want to be is a big part of this time in your life. It's normal to have questions about your identity. Would you like to share more about what you're discovering about yourself?";
  }
  
  // Default adolescent reflection
  return "Thank you for sharing that with me. Your perspective is valuable and your feelings are valid. Would you like to explore this further?";
};

/**
 * Generates a reflection for young adults (18-25)
 * Focuses on transition to independence, identity, and life choices
 */
const generateYoungAdultReflection = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for common young adult topics
  if (lowerInput.includes('college') || lowerInput.includes('university') || 
      lowerInput.includes('class') || lowerInput.includes('major')) {
    return "College can be both exciting and challenging. It sounds like you're thinking about your educational experience. How are you feeling about this part of your life right now?";
  }
  
  if (lowerInput.includes('career') || lowerInput.includes('job') || 
      lowerInput.includes('work') || lowerInput.includes('future')) {
    return "Thinking about career paths and future plans is a big part of this stage of life. It sounds like you're considering your professional direction. Would you like to explore these thoughts more?";
  }
  
  if (lowerInput.includes('relationship') || lowerInput.includes('dating') || 
      lowerInput.includes('partner') || lowerInput.includes('love')) {
    return "Relationships can bring both joy and challenges. It sounds like you're thinking about your personal connections. Would you like to share more about what's happening in this area of your life?";
  }
  
  if (lowerInput.includes('independent') || lowerInput.includes('on my own') || 
      lowerInput.includes('apartment') || lowerInput.includes('moving out')) {
    return "The transition to independence brings many new experiences and responsibilities. It sounds like you're navigating this change. How are you feeling about this process?";
  }
  
  if (lowerInput.includes('identity') || lowerInput.includes('who I am') || 
      lowerInput.includes('purpose') || lowerInput.includes('meaning')) {
    return "Exploring your identity and purpose is an important journey. It sounds like you're reflecting on who you are and what matters to you. Would you like to discuss these thoughts further?";
  }
  
  // Default young adult reflection
  return "Thank you for sharing that with me. This time in life often brings significant growth and change. Would you like to explore these thoughts more deeply?";
};

/**
 * Generates a reflection for adults
 * Uses full range of emotional complexity and life experiences
 */
const generateAdultReflection = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for common adult topics
  if (lowerInput.includes('work') || lowerInput.includes('job') || 
      lowerInput.includes('career') || lowerInput.includes('professional')) {
    return "Work and career can be a significant part of our identity and daily life. It sounds like you're reflecting on your professional experiences. How are you feeling about this aspect of your life?";
  }
  
  if (lowerInput.includes('relationship') || lowerInput.includes('partner') || 
      lowerInput.includes('marriage') || lowerInput.includes('spouse')) {
    return "Relationships are complex and evolve over time. It sounds like you're thinking about an important relationship in your life. Would you like to explore your thoughts and feelings about this further?";
  }
  
  if (lowerInput.includes('family') || lowerInput.includes('parent') || 
      lowerInput.includes('child') || lowerInput.includes('kid')) {
    return "Family dynamics can bring both joy and challenges. It sounds like you're reflecting on your family relationships. How are you feeling about this part of your life right now?";
  }
  
  if (lowerInput.includes('stress') || lowerInput.includes('anxiety') || 
      lowerInput.includes('overwhelm') || lowerInput.includes('pressure')) {
    return "Managing stress and life's pressures can be challenging. It sounds like you're experiencing some difficult feelings right now. Would it help to talk more about what's contributing to these feelings?";
  }
  
  if (lowerInput.includes('change') || lowerInput.includes('transition') || 
      lowerInput.includes('decision') || lowerInput.includes('crossroads')) {
    return "Periods of change and decision-making can bring up many emotions. It sounds like you're navigating a transition or important choice. How are you approaching this situation?";
  }
  
  if (lowerInput.includes('purpose') || lowerInput.includes('meaning') || 
      lowerInput.includes('fulfillment') || lowerInput.includes('satisfaction')) {
    return "Reflecting on purpose and meaning is an important part of the human experience. It sounds like you're thinking about what brings fulfillment to your life. Would you like to explore these thoughts further?";
  }
  
  // Default adult reflection
  return "Thank you for sharing that with me. Your experiences and perspectives are valuable. Would you like to explore these thoughts more deeply?";
};
