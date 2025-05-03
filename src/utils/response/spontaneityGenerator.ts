
/**
 * Spontaneity Generator
 * 
 * Adds variety, randomness, and unique personality traits to Roger's responses
 * UNIVERSAL LAW: Ensure Roger's responses are spontaneous and varied
 */

// Define different personality modes to add variety
export type PersonalityMode = 
  'curious' | 
  'empathetic' | 
  'reflective' | 
  'direct' | 
  'analytical' | 
  'warm' | 
  'thoughtful' | 
  'conversational' |
  'gentle' |
  'grounded';

/**
 * Returns a random personality mode to vary response styles
 */
export const getRandomPersonality = (): PersonalityMode => {
  const personalities: PersonalityMode[] = [
    'curious', 'empathetic', 'reflective', 'direct', 
    'analytical', 'warm', 'thoughtful', 'conversational',
    'gentle', 'grounded'
  ];
  
  return personalities[Math.floor(Math.random() * personalities.length)];
};

/**
 * Generate sentence starters based on personality mode
 */
export const getSentenceStarters = (mode: PersonalityMode): string[] => {
  switch (mode) {
    case 'curious':
      return [
        "I wonder if", 
        "What if we looked at this from", 
        "I'm curious about", 
        "Have you considered",
        "I'm wondering",
        "Something I'm thinking about is"
      ];
    case 'empathetic':
      return [
        "That sounds really", 
        "I can imagine how", 
        "It makes sense you'd feel", 
        "Many people would feel",
        "That experience sounds"
      ];
    case 'reflective':
      return [
        "Looking at this situation", 
        "Reflecting on what you've shared", 
        "Taking a step back", 
        "Considering the whole picture",
        "From what I understand"
      ];
    case 'direct':
      return [
        "Simply put", 
        "The key part seems to be", 
        "Let's focus on", 
        "What strikes me is",
        "I think what's happening is"
      ];
    case 'analytical':
      return [
        "When we break this down", 
        "There seem to be a few elements at play", 
        "Looking at the pattern", 
        "The dynamics here suggest",
        "If we analyze this situation"
      ];
    case 'warm':
      return [
        "I really appreciate you sharing", 
        "It takes courage to talk about", 
        "Thank you for opening up about", 
        "I value your willingness to discuss",
        "It means a lot that you'd share"
      ];
    case 'thoughtful':
      return [
        "I've been thinking about what you said", 
        "Something that comes to mind is", 
        "This reminds me of", 
        "I've noticed that when",
        "There's something interesting about"
      ];
    case 'conversational':
      return [
        "You know", 
        "So", 
        "Actually", 
        "Interestingly enough",
        "To be honest",
        "Well"
      ];
    case 'gentle':
      return [
        "Perhaps we might", 
        "Maybe there's a way", 
        "We could possibly", 
        "It might be helpful to",
        "Sometimes it can help to"
      ];
    case 'grounded':
      return [
        "Based on what you've shared", 
        "From what I understand", 
        "Given what you've told me", 
        "Looking at the facts",
        "Considering your situation"
      ];
    default:
      return [
        "I'm thinking", 
        "It seems like", 
        "From my perspective", 
        "What stands out to me"
      ];
  }
};

/**
 * Generate transition phrases based on personality mode
 */
export const getTransitionPhrases = (mode: PersonalityMode): string[] => {
  const commonTransitions = [
    "On another note", 
    "Something else to consider", 
    "Additionally", 
    "What's also important",
    "Another aspect",
    "Related to this"
  ];
  
  const modeSpecificTransitions: Record<PersonalityMode, string[]> = {
    'curious': [
      "I'm also curious about", 
      "Another question that comes up", 
      "I wonder also"
    ],
    'empathetic': [
      "I also hear that you're feeling", 
      "Another emotion that might be present", 
      "It also makes sense that"
    ],
    'reflective': [
      "Looking at this from another angle", 
      "Another perspective might be", 
      "Considering this differently"
    ],
    'direct': [
      "Another key point", 
      "Let's also look at", 
      "We should also address"
    ],
    'analytical': [
      "Another factor to analyze", 
      "A second component here", 
      "The other variable in this situation"
    ],
    'warm': [
      "I also want to acknowledge", 
      "Another thing I appreciate", 
      "I'm also struck by"
    ],
    'thoughtful': [
      "Another thought that comes to mind", 
      "I'm also reflecting on", 
      "Something else I've been considering"
    ],
    'conversational': [
      "Also", 
      "By the way", 
      "That reminds me"
    ],
    'gentle': [
      "Perhaps we might also", 
      "Maybe another approach could be", 
      "We might also consider"
    ],
    'grounded': [
      "Another relevant point", 
      "Also relevant is", 
      "We should also consider the fact that"
    ]
  };
  
  // Combine common transitions with mode-specific ones
  const allTransitions = [...commonTransitions, ...modeSpecificTransitions[mode]];
  
  return allTransitions;
};

/**
 * Generate closing phrases based on personality mode
 */
export const getClosingPhrases = (mode: PersonalityMode): string[] => {
  const commonClosings = [
    "What are your thoughts on this?",
    "Does that resonate with you?",
    "How does that sound to you?",
    "What do you think?",
    "Is that something you've considered?"
  ];
  
  const modeSpecificClosings: Record<PersonalityMode, string[]> = {
    'curious': [
      "What aspects of this feel most important to you right now?",
      "I'm curious how you're feeling about this?",
      "What else should we explore about this?"
    ],
    'empathetic': [
      "How are you feeling as we talk about this?",
      "What emotions are coming up for you right now?",
      "How does talking about this feel?"
    ],
    'reflective': [
      "Looking back, what stands out to you most about this experience?",
      "What would you do differently if you could?",
      "How has your perspective on this changed over time?"
    ],
    'direct': [
      "What's your main concern about this situation?",
      "What would you like to focus on next?",
      "What's the most important part we should address?"
    ],
    'analytical': [
      "What patterns do you notice in how you respond to these situations?",
      "What factors seem to influence this the most?",
      "How would you break down the key elements here?"
    ],
    'warm': [
      "I appreciate you sharing this with me. What else would be helpful to talk about?",
      "Thank you for trusting me with this. What would feel supportive right now?",
      "I value hearing your experience. Where would you like to go from here?"
    ],
    'thoughtful': [
      "I'm wondering what meaning you make of this experience?",
      "What do you think this situation reveals about what matters to you?",
      "How does this connect to other aspects of your life?"
    ],
    'conversational': [
      "So what happened next?",
      "And then what?",
      "How'd that go?"
    ],
    'gentle': [
      "Perhaps we could explore this a bit more, if you're comfortable?",
      "Maybe there's more to this you'd like to share?",
      "Would it be helpful to talk more about this aspect?"
    ],
    'grounded': [
      "Based on what you've shared, what would be most helpful to focus on?",
      "Given everything you've mentioned, what's your priority here?",
      "What specific aspect of this situation would you like support with?"
    ]
  };
  
  // Combine common closings with mode-specific ones
  const allClosings = [...commonClosings, ...modeSpecificClosings[mode]];
  
  return allClosings;
};

/**
 * Generate personal touches based on personality mode
 */
export const getPersonalTouches = (mode: PersonalityMode): string[] => {
  const commonPersonalTouches = [
    "I've definitely been in similar situations myself.",
    "I remember feeling that way too in a situation once.",
    "Those kinds of moments really stick with us sometimes.",
    "That's such a relatable experience."
  ];
  
  const modeSpecificTouches: Record<PersonalityMode, string[]> = {
    'curious': [
      "I once wondered the same thing about a similar situation.",
      "That reminds me of a question I've been exploring in my own life."
    ],
    'empathetic': [
      "I felt something similar when I was in a comparable situation.",
      "That kind of experience can really stay with you - I know it did for me."
    ],
    'reflective': [
      "Looking back at my own experiences like this, I've noticed patterns in how I respond.",
      "I've found that reflecting on these moments can sometimes reveal unexpected insights."
    ],
    'direct': [
      "I've had to face this kind of challenge head-on myself.",
      "In my experience, naming these situations directly helps process them."
    ],
    'analytical': [
      "I've noticed in my own life that these situations often have multiple factors influencing them.",
      "When I analyze my own similar experiences, I see how complex the emotions can be."
    ],
    'warm': [
      "I really appreciate you sharing this - it reminds me of moments that have shaped my own growth.",
      "There's something so human about this experience you're describing."
    ],
    'thoughtful': [
      "Your story makes me think about how these small moments can carry significant meaning.",
      "I find myself thinking about how these interactions shape our sense of self."
    ],
    'conversational': [
      "Oh yeah, I totally get that. I spilled coffee all over myself before an important meeting once.",
      "Man, awkward moments like that happen to all of us!"
    ],
    'gentle': [
      "Sometimes I remind myself that we all have moments like these.",
      "I've learned to be a bit gentler with myself in similar situations."
    ],
    'grounded': [
      "From my experience, focusing on what we can control in these situations helps.",
      "I've found that these moments, while uncomfortable, are rarely as significant as they feel at the time."
    ]
  };
  
  // Combine common personal touches with mode-specific ones
  const allPersonalTouches = [...commonPersonalTouches, ...modeSpecificTouches[mode]];
  
  return allPersonalTouches;
};

/**
 * Generate spontaneous perspectives based on user input
 */
export const generateSpontaneousPerspective = (
  userInput: string,
  mode: PersonalityMode
): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for specific topics and generate relevant perspectives
  if (lowerInput.includes('nervous') || 
      lowerInput.includes('anxious') || 
      lowerInput.includes('worry')) {
    
    const anxietyPerspectives = [
      "Those moments of nervousness can feel so intense in the moment, but they often look different when we get some distance.",
      "It's interesting how our nervous system can sometimes hijack our experiences, making small moments feel much bigger.",
      "I've found that naming the anxiety sometimes gives us just enough separation to see the situation more clearly.",
      "Nervousness often has a way of making us focus on ourselves, when others might not even notice what we're concerned about."
    ];
    
    return anxietyPerspectives[Math.floor(Math.random() * anxietyPerspectives.length)];
  }
  
  if (lowerInput.includes('embarrass') || 
      lowerInput.includes('awkward') || 
      lowerInput.includes('spill')) {
    
    const embarrassmentPerspectives = [
      "Those embarrassing moments can feel so huge to us, but others often barely remember them.",
      "It's interesting how we tend to replay our embarrassing moments while rarely remembering others'.",
      "I've noticed that my own embarrassing moments that felt catastrophic at the time seem much smaller with time.",
      "The things that embarrass us often reveal what we value or what matters to us."
    ];
    
    return embarrassmentPerspectives[Math.floor(Math.random() * embarrassmentPerspectives.length)];
  }
  
  // Default perspectives based on personality mode
  switch (mode) {
    case 'curious':
      return "I wonder what this situation might look like from a different angle or perspective.";
    case 'empathetic':
      return "These kinds of experiences often bring up complex feelings that take time to process.";
    case 'reflective':
      return "Sometimes these moments reveal something deeper about our values or what matters to us.";
    case 'direct':
      return "It's often helpful to name exactly what's bothering us about situations like these.";
    case 'analytical':
      return "There are usually multiple factors at play in these kinds of interactions.";
    case 'warm':
      return "It takes courage to share these kinds of experiences and feelings.";
    case 'thoughtful':
      return "These moments often connect to broader patterns or themes in our lives.";
    case 'conversational':
      return "Life throws these curveballs at all of us sometimes.";
    case 'gentle':
      return "It's important to be kind to ourselves when we're processing these kinds of experiences.";
    case 'grounded':
      return "Focusing on what we can control often helps in situations like these.";
    default:
      return "Our reactions to these situations often tell us something important about ourselves.";
  }
};

// Import necessary components and utilities
import { createMessage } from '../../utils/messageUtils';
import { detectConversationPatterns } from '../patternDetection';

/**
 * Generate a response with enhanced spontaneity and personality variation
 * 
 * This function creates responses that feel more natural and less formulaic
 * by incorporating varied phrasing, thinking patterns, and conversation styles
 * UNIVERSAL LAW: Always incorporate spontaneity and varied personality
 * 
 * @param userInput The user's message
 * @param recentResponses Previous responses to avoid repetition
 * @param spontaneityLevel Level of spontaneity (0-100)
 * @param creativityLevel Level of creativity (0-100)
 * @param personalityMode Selected personality mode
 * @returns A spontaneous response
 */
export const generateEnhancedResponse = (
  userInput: string,
  recentResponses: string[] = [],
  spontaneityLevel: number = 70,
  creativityLevel: number = 65,
  personalityMode: PersonalityMode = 'conversational'
): string => {
  // Base on personality mode
  const sentenceStarters = getSentenceStarters(personalityMode);
  const transitionPhrases = getTransitionPhrases(personalityMode);
  const closingPhrases = getClosingPhrases(personalityMode);
  const personalTouches = getPersonalTouches(personalityMode);
  
  // Select starter, transition, and closing based on personality
  const starter = sentenceStarters[Math.floor(Math.random() * sentenceStarters.length)];
  const transition = transitionPhrases[Math.floor(Math.random() * transitionPhrases.length)];
  const closing = closingPhrases[Math.floor(Math.random() * closingPhrases.length)];
  
  // Generate a spontaneous perspective based on user input and personality
  const perspective = generateSpontaneousPerspective(userInput, personalityMode);
  
  // Add a personal touch based on spontaneity level
  let personalTouch = '';
  if (Math.random() * 100 < spontaneityLevel) {
    personalTouch = ' ' + personalTouches[Math.floor(Math.random() * personalTouches.length)];
  }
  
  // Generate core content based on user input and creativity level
  const coreContent = generateTopicSpecificResponse(userInput, creativityLevel);
  
  // Create a coherent response with varied structure
  if (Math.random() > 0.5) {
    // Structure 1: Starter + Core + Transition + Perspective + Personal touch + Closing
    return `${starter} ${coreContent}. ${transition}, ${perspective}.${personalTouch} ${closing}`;
  } else {
    // Structure 2: Starter + Perspective + Transition + Core + Personal touch + Closing
    return `${starter} ${perspective}. ${transition}, ${coreContent}.${personalTouch} ${closing}`;
  }
};

/**
 * Generate specific response content based on topic detection
 */
const generateTopicSpecificResponse = (
  userInput: string,
  creativityLevel: number
): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Detect social situations
  if (lowerInput.includes('embarrass') || 
      lowerInput.includes('awkward') || 
      lowerInput.includes('spill') ||
      lowerInput.includes('nervous') ||
      lowerInput.includes('girl') ||
      lowerInput.includes('bar') ||
      lowerInput.includes('social')) {
    
    const socialResponses = [
      "social moments like the one you described often feel bigger to us than they do to others",
      "these kinds of social interactions can make us feel so self-conscious, even though others might barely remember them",
      "navigating social situations can be challenging, especially when we feel attracted to someone",
      "those moments when we feel embarrassed can seem huge to us, but others are typically focused on their own experiences",
      "feeling awkward in social settings is something most people relate to, even if we don't talk about it openly",
      "our brains tend to magnify embarrassing moments, while others might just see them as normal human interactions"
    ];
    
    return socialResponses[Math.floor(Math.random() * socialResponses.length)];
  }
  
  // Detect regret/missed opportunity
  if (lowerInput.includes('regret') || 
      lowerInput.includes('should have') || 
      lowerInput.includes('could have') ||
      lowerInput.includes('wished') ||
      lowerInput.includes('missed opportunity')) {
    
    const regretResponses = [
      "hindsight often gives us a clarity that wasn't available in the moment",
      "it's natural to reflect on what could have been different, though we made the best decision we could at the time",
      "those 'should have' thoughts can be hard to shake, though they don't always account for how we felt in the moment",
      "replaying interactions and thinking of better responses is something most of us do",
      "it's interesting how we often judge our past actions with information we didn't have at the time",
      "sometimes those moments of regret tell us something about what's important to us"
    ];
    
    return regretResponses[Math.floor(Math.random() * regretResponses.length)];
  }
  
  // Detect work/career concerns
  if (lowerInput.includes('work') || 
      lowerInput.includes('job') || 
      lowerInput.includes('career') ||
      lowerInput.includes('boss') ||
      lowerInput.includes('coworker') ||
      lowerInput.includes('colleague')) {
    
    const workResponses = [
      "workplace dynamics can be complex, especially when navigating relationships with colleagues",
      "work situations often bring up interesting questions about our values and boundaries",
      "balancing professional responsibilities with personal needs can be challenging",
      "our work environments can have a significant impact on our overall wellbeing",
      "the relationships we form at work can sometimes be complex to navigate",
      "finding the right balance between assertiveness and collaboration at work isn't always easy"
    ];
    
    return workResponses[Math.floor(Math.random() * workResponses.length)];
  }
  
  // Default creative responses for general topics
  const defaultResponses = [
    "what you're describing sounds like it has multiple layers to it",
    "experiences like these often reveal something about our expectations and values",
    "there's something interesting about how these situations affect us",
    "this kind of situation can bring up a mix of emotions and thoughts",
    "the way we interpret these experiences often connects to our broader life patterns",
    "these moments sometimes tell us something important about ourselves"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

/**
 * Generate a completely spontaneous response to break repetition patterns
 */
export const generateSpontaneousResponse = (
  userInput: string, 
  recentResponses: string[] = [],
  spontaneityLevel: number = 75,
  creativityLevel: number = 70,
  personalityMode: PersonalityMode = getRandomPersonality()
): string => {
  // For maximum spontaneity, use an entirely different approach
  // This is specifically designed to break any detected repetition patterns
  
  // First, detect what topics might be present in the user's message
  const topics = detectTopics(userInput);
  
  // Use the enhanced response generator with high spontaneity
  const response = generateEnhancedResponse(
    userInput,
    recentResponses,
    Math.max(spontaneityLevel, 80), // Ensure high spontaneity
    Math.max(creativityLevel, 75),  // Ensure high creativity
    personalityMode
  );
  
  // If we have recent responses, make sure we're not repeating patterns
  if (recentResponses.length > 0) {
    // Check if the generated response might be too similar
    const isTooSimilar = recentResponses.some(recentResponse => 
      hasCommonPhrases(response, recentResponse)
    );
    
    if (isTooSimilar) {
      // Try a completely different approach using topic-specific logic
      if (topics.includes('socialSituation') || topics.includes('embarrassment')) {
        const socialAlternatives = [
          "Social moments like these are interesting - they often feel much more significant to us than they do to other people. What do you think the other person's perspective might have been?",
          "I'm curious about what would have felt like a satisfying way to handle that situation. If you could go back, what would feel good to say or do?",
          "Those split-second social decisions can be tough to navigate. What do you think was behind your hesitation to stay and talk more?",
          "Sometimes these awkward moments reveal something about what matters to us. What does your reaction tell you about what's important to you in social interactions?"
        ];
        return socialAlternatives[Math.floor(Math.random() * socialAlternatives.length)];
      }
      
      if (topics.includes('regret') || topics.includes('shouldHave')) {
        const regretAlternatives = [
          "Those 'should have' thoughts can be really persistent. I'm curious - what would have felt most authentic to you in that moment?",
          "It's interesting how we often replay these interactions. What would the most compassionate perspective on this situation be?",
          "Sometimes regret points us toward what we value. What does this experience tell you about what matters to you?",
          "If a good friend had been in your exact situation and handled it the same way, what would you say to them?"
        ];
        return regretAlternatives[Math.floor(Math.random() * regretAlternatives.length)];
      }
    }
  }
  
  return response;
};

// Helper function to detect key topics in user input
const detectTopics = (userInput: string): string[] => {
  const input = userInput.toLowerCase();
  const topics: string[] = [];
  
  if (/embarrass|awkward|nervous|spill|stumble|clumsy|uncomfortable/i.test(input)) {
    topics.push('embarrassment');
  }
  
  if (/friend|girl|guy|date|bar|social|people|conversation|party/i.test(input)) {
    topics.push('socialSituation');
  }
  
  if (/regret|wish|missed|opportunity|sorry/i.test(input)) {
    topics.push('regret');
  }
  
  if (/could have|should have|would have|better|differently/i.test(input)) {
    topics.push('shouldHave');
  }
  
  if (/work|job|career|boss|coworker|colleague|office/i.test(input)) {
    topics.push('work');
  }
  
  if (/family|parent|mom|dad|brother|sister|sibling/i.test(input)) {
    topics.push('family');
  }
  
  if (/health|sick|illness|doctor|hospital|pain|symptom/i.test(input)) {
    topics.push('health');
  }
  
  return topics;
};

// Helper function to detect common phrases between responses
const hasCommonPhrases = (text1: string, text2: string): boolean => {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  // Check for 3-word sequences (reduced from 4 to catch more similarities)
  for (let i = 0; i <= words1.length - 3; i++) {
    const phrase = words1.slice(i, i + 3).join(' ');
    if (words2.join(' ').includes(phrase)) {
      return true;
    }
  }
  
  return false;
};
